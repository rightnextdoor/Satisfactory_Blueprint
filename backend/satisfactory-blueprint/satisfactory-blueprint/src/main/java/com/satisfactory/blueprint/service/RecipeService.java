package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.dto.ItemDataDto;
import com.satisfactory.blueprint.dto.RecipeDto;
import com.satisfactory.blueprint.entity.Planner;
import com.satisfactory.blueprint.entity.Recipe;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.exception.ResourceNotFoundException;
import com.satisfactory.blueprint.repository.BuildingRepository;
import com.satisfactory.blueprint.repository.ItemRepository;
import com.satisfactory.blueprint.repository.PlannerRepository;
import com.satisfactory.blueprint.repository.RecipeRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecipeService {

    private final RecipeRepository        recipeRepository;
    private final ItemRepository          itemRepository;
    private final BuildingRepository      buildingRepository;
    private final PlannerRepository plannerRepository;
    private final PlannerService plannerService;

    public RecipeService(
            RecipeRepository recipeRepository,
            ItemRepository itemRepository,
            BuildingRepository buildingRepository,
            PlannerRepository plannerRepository,
            @Lazy PlannerService plannerService
    ) {
        this.recipeRepository       = recipeRepository;
        this.itemRepository         = itemRepository;
        this.buildingRepository     = buildingRepository;
        this.plannerRepository    = plannerRepository;
        this.plannerService       = plannerService;
    }

    public List<Recipe> findAll() {
        return recipeRepository.findAll();
    }

    public Recipe findById(Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));
    }

    public List<Recipe> findByItemName(String itemName) {
        List<Recipe> recipes = recipeRepository.findByItemToBuild_Item_NameIgnoreCase(itemName);
        if (recipes.isEmpty()) {
            throw new ResourceNotFoundException("No recipes found producing item: " + itemName);
        }
        return recipes;
    }

    public Recipe getDefaultByItemName(String itemName) {
        // 1) try the non‐alternate recipe
        return recipeRepository
                .findFirstByItemToBuild_Item_NameIgnoreCaseAndAlternateFalse(itemName)
                // 2) if none, fall back to the first alternate recipe
                .orElseGet(() ->
                        recipeRepository
                                .findFirstByItemToBuild_Item_NameIgnoreCaseAndAlternateTrue(itemName)
                                .orElseThrow(() ->
                                        new ResourceNotFoundException(
                                                "Default recipe not found for item: " + itemName
                                        )
                                )
                );
    }

    public Recipe getReplacementRecipe(String itemName, Long excludeRecipeId) {
        // 1) try non-alternate, excluding the deleted one
        Optional<Recipe> nonAlt = recipeRepository
                .findFirstByItemToBuild_Item_NameIgnoreCaseAndAlternateFalseAndIdNot(itemName, excludeRecipeId);

        if (nonAlt.isPresent()) return nonAlt.get();

        // 2) try alternate, excluding the deleted one
        Optional<Recipe> alt = recipeRepository
                .findFirstByItemToBuild_Item_NameIgnoreCaseAndAlternateTrueAndIdNot(itemName, excludeRecipeId);

        return alt.orElseThrow(() ->
                new ResourceNotFoundException(
                        "Cannot replace “" + itemName + "” – no other recipe available to replace it"
                )
        );
    }


    public Recipe create(RecipeDto dto) {
        // 1) core fields
        Recipe recipe = new Recipe();
        populateRecipe(recipe, dto);
        return recipeRepository.save(recipe);
    }

    public Recipe update(Long id, RecipeDto dto) {
        Recipe existing = recipeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Recipe not found: " + id));

        populateRecipe(existing,dto);
        recipeRepository.save(existing);
        plannerService.refreshEntriesForRecipe(existing);
        return existing;
    }

    public void delete(Long id) {
        Recipe existing = recipeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Recipe not found: " + id));

        plannerService.removeRecipeFromAllPlanners(existing.getId());

        // 3. Now safe to delete the recipe
        recipeRepository.delete(existing);
    }


    private ItemData toItemData(ItemDataDto dto) {
        ItemData data = new ItemData();
        data.setItem(
                itemRepository.findById(dto.getItem().getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Item not found: " + dto.getItem().getId()))
        );
        data.setAmount(dto.getAmount());
        return data;
    }

    private void populateRecipe(Recipe recipe, RecipeDto dto){
        recipe.setAlternate(dto.isAlternate());
        recipe.setSpaceElevator(dto.isSpaceElevator());
        recipe.setFuel(dto.isFuel());
        recipe.setWeaponOrTool(dto.isWeaponOrTool());
        recipe.setTier(dto.getTier());

        recipe.setBuilding(
                buildingRepository.findByType(dto.getBuilding())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Building not found: " + dto.getBuilding()))
        );

        // by-product
        if (dto.getByProduct() != null) {
            recipe.setHasByProduct(true);
            recipe.setByProduct(toItemData(dto.getByProduct()));
        } else {
            recipe.setHasByProduct(false);
            recipe.setByProduct(null);
        }

        recipe.setItemToBuild(toItemData(dto.getItemToBuild()));

        List<ItemData> newItems = Optional.ofNullable(dto.getItems())
                .orElse(Collections.emptyList())
                .stream()
                .map(this::toItemData)
                .collect(Collectors.toList());
        recipe.getItems().clear();
        recipe.getItems().addAll(newItems);
    }
}
