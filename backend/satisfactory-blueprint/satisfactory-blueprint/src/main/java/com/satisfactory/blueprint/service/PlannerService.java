package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.entity.Planner;
import com.satisfactory.blueprint.entity.PlannerEntry;
import com.satisfactory.blueprint.entity.Recipe;
import com.satisfactory.blueprint.exception.BadRequestException;
import com.satisfactory.blueprint.exception.ResourceNotFoundException;
import com.satisfactory.blueprint.repository.PlannerEntryRepository;
import com.satisfactory.blueprint.repository.PlannerRepository;
import com.satisfactory.blueprint.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PlannerService {

    private final PlannerRepository plannerRepo;
    private final PlannerEntryRepository entryRepo;
    private final RecipeRepository recipeRepo;

    public PlannerService(PlannerRepository plannerRepo,
                          PlannerEntryRepository entryRepo,
                          RecipeRepository recipeRepo) {
        this.plannerRepo = plannerRepo;
        this.entryRepo = entryRepo;
        this.recipeRepo = recipeRepo;
    }

    /** List all planners, most recently updated first */
    public List<Planner> findAll() {
        return plannerRepo.findAllByOrderByUpdatedAtDesc();
    }

    /** Get a planner by ID or throw 404 */
    public Planner findById(Long id) {
        return plannerRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Planner not found with id: " + id));
    }

    /** Create a new planner */
    public Planner create(String name, boolean isFuelFactory) {
        Planner plan = new Planner();
        plan.setName(name);
        plan.setFuelFactory(isFuelFactory);
        return plannerRepo.save(plan);
    }

    /** Update a planner's name or fuel‐factory flag */
    public Planner update(Long id, String name, Boolean isFuelFactory) {
        Planner existing = findById(id);
        if (name != null && !name.isBlank()) {
            existing.setName(name);
        }
        if (isFuelFactory != null) {
            existing.setFuelFactory(isFuelFactory);
        }
        return plannerRepo.save(existing);
    }

    /** Delete a planner (and its entries) */
    public void delete(Long id) {
        Planner plan = findById(id);
        plannerRepo.delete(plan);
    }

    /**
     * Add a new entry (recipe + buildingCount) to a planner.
     * Enforces at most one entry per output item.
     */
    public PlannerEntry addEntry(Long plannerId, Long recipeId, int buildingCount) {
        Planner plan = findById(plannerId);
        Recipe recipe = recipeRepo.findById(recipeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Recipe not found with id: " + recipeId));

        Long itemId = recipe.getItemToBuild().getId();
        boolean duplicate = plan.getEntries().stream()
                .anyMatch(e -> e.getRecipe().getItemToBuild().getId().equals(itemId));
        if (duplicate) {
            throw new BadRequestException(
                    "An entry for item '"
                            + recipe.getItemToBuild().getName()
                            + "' already exists in this plan.");
        }

        PlannerEntry entry = new PlannerEntry();
        entry.setPlanner(plan);
        entry.setRecipe(recipe);
        entry.setBuildingCount(buildingCount);
        // defaults
        entry.setOutgoingAmountPerMinute(0.0);
        entry.setRecipeManuallySelected(false);

        plan.getEntries().add(entry);
        plannerRepo.save(plan);
        return entry;
    }

    /**
     * Update an existing planner entry:
     * - buildingCount and/or outgoingAmountPerMinute
     * - optionally switch to a different recipe (manual override)
     */
    public PlannerEntry updateEntry(
            Long entryId,
            Integer buildingCount,
            Double outgoingAmountPerMinute,
            Long newRecipeId
    ) {
        PlannerEntry entry = entryRepo.findById(entryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("PlannerEntry not found: " + entryId));

        if (buildingCount != null) {
            entry.setBuildingCount(buildingCount);
        }
        if (outgoingAmountPerMinute != null) {
            entry.setOutgoingAmountPerMinute(outgoingAmountPerMinute);
        }
        if (newRecipeId != null
                && !newRecipeId.equals(entry.getRecipe().getId())) {

            Recipe newRecipe = recipeRepo.findById(newRecipeId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Recipe not found: " + newRecipeId));

            Long newItemId = newRecipe.getItemToBuild().getId();
            boolean duplicate = entry.getPlanner().getEntries().stream()
                    .anyMatch(e ->
                            !e.getId().equals(entryId)
                                    && e.getRecipe().getItemToBuild().getId().equals(newItemId)
                    );
            if (duplicate) {
                throw new BadRequestException(
                        "An entry for item '"
                                + newRecipe.getItemToBuild().getName()
                                + "' already exists in this plan.");
            }

            entry.setRecipe(newRecipe);
            entry.setRecipeManuallySelected(true);
        }

        return entryRepo.save(entry);
    }

    /** Remove an entry from its planner */
    public void deleteEntry(Long entryId) {
        PlannerEntry entry = entryRepo.findById(entryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("PlannerEntry not found: " + entryId));
        Planner plan = entry.getPlanner();
        plan.getEntries().remove(entry);
        entryRepo.delete(entry);
    }
}
