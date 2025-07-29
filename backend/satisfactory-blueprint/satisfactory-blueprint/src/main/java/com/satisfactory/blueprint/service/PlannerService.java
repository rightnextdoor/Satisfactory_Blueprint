package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.dto.PlannerDto;
import com.satisfactory.blueprint.dto.PlannerEntryDto;
import com.satisfactory.blueprint.dto.PlannerAllocationDto;
import com.satisfactory.blueprint.entity.Generator;
import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.entity.Planner;
import com.satisfactory.blueprint.entity.Recipe;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.entity.embedded.PlannerAllocation;
import com.satisfactory.blueprint.entity.PlannerEntry;
import com.satisfactory.blueprint.entity.enums.FuelType;
import com.satisfactory.blueprint.entity.enums.PlannerMode;
import com.satisfactory.blueprint.entity.enums.PlannerTargetType;
import com.satisfactory.blueprint.exception.ResourceNotFoundException;
import com.satisfactory.blueprint.repository.GeneratorRepository;
import com.satisfactory.blueprint.repository.PlannerEntryRepository;
import com.satisfactory.blueprint.repository.PlannerRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
public class PlannerService {
    private final PlannerRepository   plannerRepo;
    private final PlannerEntryRepository entryRepo;
    private final GeneratorRepository generatorRepo;
    private final RecipeService       recipeService;

    public PlannerService(PlannerRepository plannerRepo,
                          PlannerEntryRepository entryRepo,
                          GeneratorRepository generatorRepo,
                          @Lazy RecipeService recipeService) {
        this.plannerRepo    = plannerRepo;
        this.entryRepo      = entryRepo;
        this.generatorRepo  = generatorRepo;
        this.recipeService  = recipeService;
    }

    //––– CRUD: findAll, findById, deletePlanner –––

    public List<Planner> findAll() {
        return plannerRepo.findAll();
    }

    public Planner findById(Long id) {
        return plannerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Planner not found: " + id));
    }

    public Planner deletePlanner(Long id) {
        Planner p = findById(id);
        plannerRepo.delete(p);
        return p;
    }

    //––– CREATE –––

    public Planner create(PlannerDto dto) {
        Planner p = new Planner();
        p.setMode(dto.getMode());
        populatePlannerCore(p, dto);

        if (p.getMode() == PlannerMode.FUEL) {
            buildDefaultFuelEntries(p);
        } else {
            p.setEntries(new ArrayList<>());
            p.setResources(Collections.emptyList());
        }

        return plannerRepo.save(p);
    }

    //––– UPDATE SETTINGS –––

    public Planner updatePlannerSettings(PlannerDto dto) {
        Planner p = findById(dto.getId());



        // apply new name, mode, generator, and recalc targetAmount
        populatePlannerCore(p, dto);

        if(p.getMode() == PlannerMode.FUEL){
            // capture old settings
            Long   oldGen    = p.getGenerator() != null ? p.getGenerator().getId() : null;
            Double oldTarget = p.getTargetAmount();

            boolean isFuel     = p.getMode() == PlannerMode.FUEL;
            boolean genChanged = !Objects.equals(oldGen, dto.getGenerator().getId());
            boolean targetChanged = isFuel
                    && !Objects.equals(oldTarget, dto.getTargetAmount());

            if (isFuel && (genChanged || targetChanged)) {
                // clear existing entries so Hibernate will orphan‐delete
                p.getEntries().clear();
                plannerRepo.flush();   // ensure the deletes hit the DB immediately

                // rebuild default chain against the new targetAmount
                buildDefaultFuelEntries(p);
            }
        }

        return plannerRepo.save(p);
    }


    //––– UPDATE RECIPE ON AN ENTRY –––

    public Planner updatePlannerEntryRecipe(Long plannerId, PlannerEntryDto dto) {
        Planner planner = findById(plannerId);
        Recipe  newRecipe = recipeService.findById(dto.getRecipe().getId());

        PlannerEntry entry = entryRepo.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found: " + dto.getId()));

        // 1) swap in the recipe
        updateEntryRecipe(entry, newRecipe);
        entryRepo.save(entry);

        // 2) apply any building‐count override **before** ripple
        applyBuildingCountOverride(entry, dto);
        entryRepo.save(entry);

        // 3) ripple the rest of the graph (children will recalc, but this one is “frozen”)
        rippleAndSave(planner);
        return plannerRepo.save(planner);
    }
    private void applyBuildingCountOverride(PlannerEntry entry,
                                            PlannerEntryDto dto) {
        // 1) bail out if no override requested
        if (dto.getBuildingCount() == null) {
            return;
        }
        double overrideCount = dto.getBuildingCount();

        // 2) compute the minimum allowed (# buildings required by all allocations)
        double minimumRequired = Stream
                .concat(entry.getRecipeAllocations().stream(),
                        entry.getManualAllocations().stream())
                .mapToDouble(PlannerAllocation::getBuildingCount)
                .sum();

        if (overrideCount < minimumRequired) {
            throw new IllegalArgumentException(
                    "Cannot set building count for “"
                            + entry.getTargetItem().getName()
                            + "” below required minimum of "
                            + String.format("%.2f", minimumRequired)
            );
        }

        // 3) mark this entry as “overridden” so expandPlannerEntries leaves it alone
        entry.setBuildingOverride(true);

        // 4) apply override
        entry.setBuildingCount(overrideCount);
        double perUnitOutput = entry.getRecipe()
                .getItemToBuild()
                .getAmount();
        entry.setOutgoingAmount(overrideCount * perUnitOutput);

        // 5) rebuild ingredientAllocations off the new override
        entry.getIngredientAllocations().clear();
        for (ItemData input : entry.getRecipe().getItems()) {
            ItemData alloc = new ItemData();
            alloc.setItem(input.getItem());
            alloc.setAmount(input.getAmount() * overrideCount);
            entry.getIngredientAllocations().add(alloc);
        }
    }

    //––– UPDATE MANUAL ALLOCATION –––

    public Planner updatePlannerEntryManualAllocation(
            Long plannerId,
            Long entryId,
            PlannerAllocationDto manualDto
    ) {
        if ("Generator fuel".equalsIgnoreCase(manualDto.getLabel())) {
            throw new IllegalStateException("Cannot modify the generator’s target allocation.");
        }

        Planner planner = findById(plannerId);

        PlannerEntry entry = entryRepo.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found: " + entryId));

        updateManualAllocation(entry, manualDto);
        entryRepo.save(entry);

        rippleAndSave(planner);
        return plannerRepo.save(planner);
    }

    //––– DELETE MANUAL ALLOCATION –––

    public Planner deletePlannerEntryManualAllocation(
            Long plannerId,
            Long entryId,
            String label
    ) {
        if ("Generator fuel".equalsIgnoreCase(label)) {
            throw new IllegalStateException("Cannot remove the generator’s target allocation.");
        }
        Planner planner = findById(plannerId);

        PlannerEntry entry = entryRepo.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found: " + entryId));

        entry.getManualAllocations().removeIf(a -> a.getLabel().equalsIgnoreCase(label));
        updateEntryAllocations(entry);
        entryRepo.save(entry);

        rippleAndSave(planner);
        return plannerRepo.save(planner);
    }

    //––– DELETE AN ENTRY –––

    public void removeRecipeFromAllPlanners(Long recipeId) {
        // 1) find every planner that has an entry using the soon-to-be-deleted recipe:
        List<Planner> affected = plannerRepo.findAll().stream()
                .filter(p -> p.getEntries().stream()
                        .anyMatch(e -> e.getRecipe().getId().equals(recipeId)))
                .toList();

        for (Planner planner : affected) {
            // 2) locate the exact entry in that planner
            PlannerEntry entry = planner.getEntries().stream()
                    .filter(e -> e.getRecipe().getId().equals(recipeId))
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException(
                            "Planner " + planner.getId() + " still references recipe " + recipeId));

            String itemName = entry.getRecipe()
                    .getItemToBuild()
                    .getItem()
                    .getName();

            // 3) pick a replacement that definitely has a different ID
            Recipe replacement = recipeService.getReplacementRecipe(itemName, recipeId);

            // 4) *rebuild* that entry using your existing helper:
            updateEntryRecipe(entry, replacement);
            entryRepo.save(entry);

            // 5) now re-ripple the planner so all downstream entries get rebuilt
            rippleAndSave(planner);
            plannerRepo.save(planner);
        }
    }

    public Planner deletePlannerEntry(Long plannerId, Long entryId) {
        Planner planner = findById(plannerId);

        PlannerEntry target = entryRepo.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found: " + entryId));

        if (planner.getMode() == PlannerMode.FUEL) {
            Item fuelItem = findFuelItemData(planner).getItem();
            if (target.getTargetItem().equals(fuelItem)) {
                throw new IllegalStateException(
                        "Cannot delete the root fuel entry for generator fuel “"
                                + fuelItem.getName() + "”"
                );
            }
        }

        if (!target.getRecipeAllocations().isEmpty()) {
            List<String> deps = target.getRecipeAllocations().stream()
                    .map(a -> a.getItem().getName())
                    .distinct().toList();
            throw new IllegalStateException(
                    "Cannot delete " + target.getTargetItem().getName()
                            + "; used by: " + String.join(", ", deps)
            );
        }

        // unlink from children
        for (ItemData idata : target.getIngredientAllocations()) {
            PlannerEntry child = entryRepo.findByTargetItem(idata.getItem())
                    .orElse(null);
            if (child != null) {
                child.getRecipeAllocations().removeIf(
                        alloc -> alloc.getItem().equals(target.getTargetItem()));
                entryRepo.save(child);
            }
        }

        // remove and delete
        planner.getEntries().remove(target);
        entryRepo.delete(target);

        rippleAndSave(planner);
        return plannerRepo.save(planner);
    }

    //––– internals –––

    private void rippleAndSave(Planner planner) {
        expandPlannerEntries(planner);
        planner.setResources(calculateResources(planner));
    }

    private void populatePlannerCore(Planner p, PlannerDto dto) {
        p.setName(dto.getName());

        if (p.getMode() == PlannerMode.FUEL) {
            Generator gen = generatorRepo.findById(dto.getGenerator().getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Generator not found: " + dto.getGenerator().getId()));
            p.setGenerator(gen);
            p.setTargetType(dto.getTargetType());

            double target = dto.getTargetType() == PlannerTargetType.GENERATOR
                    ? dto.getTargetAmount() * findFuelItemData(p).getAmount()
                    : dto.getTargetAmount();
            p.setTargetAmount(target);

            ItemData addItem = findFuelItemData(gen.getFuelType(),gen.getFuelItems());
            p.setTargetItem(addItem);
            double builindCount = target / addItem.getAmount();
            p.setGeneratorBuildingCount(builindCount);

        } else {
            p.setGenerator(null);
            p.setTargetType(null);
            p.setTargetAmount(null);
            p.setTargetItem(null);
            p.setGeneratorBuildingCount(null);
        }
    }

    private ItemData findFuelItemData(Planner planner) {
        String lookup = Arrays.stream(
                        planner.getGenerator()
                                .getFuelType()
                                .name()
                                .replace("_", " ")
                                .toLowerCase()
                                .split(" ")
                ).map(w -> Character.toUpperCase(w.charAt(0)) + w.substring(1))
                .collect(Collectors.joining(" "));
        return planner.getGenerator()
                .getFuelItems().stream()
                .filter(fd -> fd.getItem().getName().equalsIgnoreCase(lookup))
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException("Fuel item not found for: " + lookup));
    }

    private void buildDefaultFuelEntries(Planner planner) {
        // find the “root” recipe for this fuel
        Recipe rootRecipe = recipeService.getDefaultByItemName(
                findFuelItemData(planner).getItem().getName()
        );

        // create the new root entry
        PlannerEntry root = buildPlannerEntry(rootRecipe, planner.getTargetAmount());
        root.setPlanner(planner);

        double targetAmt = planner.getTargetAmount();
        double perOut     = root.getRecipe().getItemToBuild().getAmount();

        PlannerAllocation genAlloc = new PlannerAllocation();
        genAlloc.setLabel("Generator fuel");
        genAlloc.setItem(null);
        genAlloc.setAmount(targetAmt);
        genAlloc.setBuildingCount(targetAmt / perOut);
        root.getManualAllocations().add(genAlloc);

        // add into the *same* list Hibernate is tracking
        planner.getEntries().add(root);

        // propagate all downstream entries + recalc resources
        rippleAndSave(planner);
    }

    private PlannerEntry buildPlannerEntry(Recipe recipe, Double targetAmount) {
        PlannerEntry e = new PlannerEntry();
        e.setRecipe(recipe);
        e.setTargetItem(recipe.getItemToBuild().getItem());

        if (targetAmount != null) {
            double count = targetAmount / recipe.getItemToBuild().getAmount();
            e.setBuildingCount(count <= 0 ? 1 : count);
        }
        e.setOutgoingAmount(e.getBuildingCount() * recipe.getItemToBuild().getAmount());

        for (ItemData input : recipe.getItems()) {
            ItemData id = new ItemData();
            id.setItem(input.getItem());
            id.setAmount(input.getAmount() * e.getBuildingCount());
            e.getIngredientAllocations().add(id);
        }
        return e;
    }

    private void expandPlannerEntries(Planner planner) {
        if (planner.getEntries() == null || planner.getEntries().isEmpty()) return;

        for (PlannerEntry e : planner.getEntries()) {
            e.getRecipeAllocations().clear();
        }

        // 1) Build a map of all entries by their target item, seed the queue
        Map<Item, PlannerEntry> map   = new LinkedHashMap<>();
        Map<String, Recipe>     cache = new HashMap<>();
        Queue<Item>             queue = new ArrayDeque<>();

        for (PlannerEntry e : planner.getEntries()) {
            if (e != null && e.getTargetItem() != null) {
                e.setPlanner(planner);
                map.put(e.getTargetItem(), e);
                queue.add(e.getTargetItem());
            }
        }

        // 2) Walk downstream ingredients, creating or updating entries as needed
        while (!queue.isEmpty()) {
            Item parent = queue.poll();
            PlannerEntry pe = map.get(parent);
            if (pe == null) continue;

            List<ItemData> inputs = pe.getIngredientAllocations();
            if (inputs == null) continue;

            for (ItemData id : inputs) {
                if (id == null || id.getItem() == null || id.getItem().isResource()) {
                    continue; // skip resources entirely
                }

                Item child = id.getItem();
                double amt = id.getAmount();

                // find or create the child entry
                PlannerEntry ce = map.get(child);
                Recipe r = (ce != null && ce.getRecipe() != null)
                        ? ce.getRecipe()
                        : cache.computeIfAbsent(
                        child.getName(),
                        name -> recipeService.getDefaultByItemName(name)
                );

                if (ce == null) {
                    ce = new PlannerEntry();
                    ce.setPlanner(planner);
                    ce.setTargetItem(child);
                    ce.setRecipe(r);
                    map.put(child, ce);
                }

                // accumulate this parent→child allocation
                PlannerAllocation alloc = new PlannerAllocation();
                alloc.setItem(parent);
                alloc.setAmount(amt);
                alloc.setBuildingCount(amt / r.getItemToBuild().getAmount());
                ce.getRecipeAllocations().add(alloc);

                // recalc build count & enqueue if changed
                double totalRecipeBc = ce.getRecipeAllocations().stream()
                        .mapToDouble(PlannerAllocation::getBuildingCount).sum();
                double totalManualBc = ce.getManualAllocations().stream()
                        .mapToDouble(PlannerAllocation::getBuildingCount).sum();
                double newCount = totalRecipeBc + totalManualBc;

                if (!ce.isBuildingOverride()
                        && Double.compare(newCount, ce.getBuildingCount()) != 0) {

                    updateEntryAllocations(ce);
                    queue.add(child);
                }
            }
        }

        // 3) Replace contents of the *same* entries list so orphans get deleted
        List<PlannerEntry> entries = planner.getEntries();
        entries.clear();
        for (PlannerEntry e : map.values()) {
            e.setPlanner(planner);
            entries.add(e);
        }
    }


    private void updateEntryRecipe(PlannerEntry entry, Recipe recipe) {
        entry.setRecipe(recipe);
        entry.setTargetItem(recipe.getItemToBuild().getItem());

        double count = entry.getBuildingCount();
        entry.setOutgoingAmount(count * recipe.getItemToBuild().getAmount());

        entry.getIngredientAllocations().clear();
        for (ItemData input : recipe.getItems()) {
            ItemData id = new ItemData();
            id.setItem(input.getItem());
            id.setAmount(input.getAmount() * count);
            entry.getIngredientAllocations().add(id);
        }
    }

    private void updateManualAllocation(PlannerEntry entry, PlannerAllocationDto dto) {
        Recipe r      = entry.getRecipe();
        double perOut = r.getItemToBuild().getAmount();

        // find existing by label or create brand-new
        PlannerAllocation alloc = entry.getManualAllocations().stream()
                .filter(a -> a.getLabel().equalsIgnoreCase(dto.getLabel()))
                .findFirst()
                .orElseGet(() -> {
                    PlannerAllocation a = new PlannerAllocation();
                    a.setLabel(dto.getLabel());
                    a.setItem(null);
                    entry.getManualAllocations().add(a);
                    return a;
                });

        // set the *manual* amount (absolute)
        alloc.setAmount(dto.getAmount());

        // **compute its own buildingCount just like recipeAllocations:**
        alloc.setBuildingCount(dto.getAmount() / perOut);

        // now recalc the *entry*’s total buildingCount & outgoingAmount
        updateEntryAllocations(entry);
    }

    private void updateEntryAllocations(PlannerEntry entry) {
        Recipe r = entry.getRecipe();
        double perOut = r.getItemToBuild().getAmount();

        double totalRecipeAmt = entry.getRecipeAllocations().stream()
                .mapToDouble(PlannerAllocation::getAmount).sum();
        double totalManualAmt = entry.getManualAllocations().stream()
                .mapToDouble(PlannerAllocation::getAmount).sum();
        double newCount = (totalRecipeAmt + totalManualAmt) / perOut;
        entry.setBuildingCount(newCount <= 0 ? 1 : newCount);
        entry.setOutgoingAmount(entry.getBuildingCount() * perOut);

        entry.getIngredientAllocations().clear();
        for (ItemData in : r.getItems()) {
            ItemData id = new ItemData();
            id.setItem(in.getItem());
            id.setAmount(in.getAmount() * entry.getBuildingCount());
            entry.getIngredientAllocations().add(id);
        }
    }

    private List<ItemData> calculateResources(Planner planner) {
        Map<Item, Double> totals = new HashMap<>();
        for (PlannerEntry e : planner.getEntries()) {
            if (e.getIngredientAllocations() == null) continue;
            for (ItemData id : e.getIngredientAllocations()) {
                if (id == null || id.getItem() == null || !id.getItem().isResource()) continue;
                totals.merge(id.getItem(), id.getAmount(), Double::sum);
            }
        }
        return totals.entrySet().stream()
                .map(e -> {
                    ItemData d = new ItemData();
                    d.setItem(e.getKey());
                    d.setAmount(e.getValue());
                    return d;
                })
                .collect(Collectors.toList());
    }

    public void refreshEntriesForRecipe(Recipe updated) {
        // 1) load every entry that uses this recipe
        List<PlannerEntry> entries = entryRepo.findAllByRecipe_Id(updated.getId());

        // 2) for each entry, re‐apply the recipe so its own ingredientAllocations get rebuilt
        Set<Planner> touched = new HashSet<>();
        for (PlannerEntry e : entries) {
            updateEntryRecipe(e, updated);    // ← this clears & rebuilds ingredientAllocations, outgoingAmount, etc.
            entryRepo.save(e);
            touched.add(e.getPlanner());
        }

        // 3) re‐ripple each affected planner so children update
        for (Planner p : touched) {
            rippleAndSave(p);
            plannerRepo.save(p);
        }
    }

    public List<ItemData> getResourcesForPlanner(Long plannerId) {
        Planner planner = plannerRepo.findById(plannerId)
                .orElseThrow(() -> new NoSuchElementException("Planner not found: " + plannerId));
        return planner.getResources();
    }

    private ItemData findFuelItemData(FuelType fuelType, List<ItemData> items) {
        String lookup = fuelType.name()
                .replace("_", " ")
                .toUpperCase();
        return items.stream()
                .filter(idata -> idata.getItem()
                        .getName()
                        .toUpperCase()
                        .equals(lookup))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Fuel item not found for: " + lookup));
    }

}
