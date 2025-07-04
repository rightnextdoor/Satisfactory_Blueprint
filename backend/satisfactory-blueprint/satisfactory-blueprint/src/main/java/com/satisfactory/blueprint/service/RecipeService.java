package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.dto.RecipeDto;
import com.satisfactory.blueprint.entity.Building;
import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.entity.Recipe;
import com.satisfactory.blueprint.exception.BadRequestException;
import com.satisfactory.blueprint.exception.ResourceNotFoundException;
import com.satisfactory.blueprint.repository.BuildingRepository;
import com.satisfactory.blueprint.repository.ItemRepository;
import com.satisfactory.blueprint.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final ItemRepository itemRepository;
    private final BuildingRepository buildingRepository;

    public RecipeService(RecipeRepository recipeRepository,
                         ItemRepository itemRepository,
                         BuildingRepository buildingRepository) {
        this.recipeRepository = recipeRepository;
        this.itemRepository = itemRepository;
        this.buildingRepository = buildingRepository;
    }

    public List<Recipe> findAll() {
        return recipeRepository.findAll();
    }

    public Recipe findById(Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));
    }

    public List<Recipe> findByItemName(String itemName) {
        List<Recipe> recipes = recipeRepository.findByItemToBuild_NameIgnoreCase(itemName);
        if (recipes.isEmpty()) {
            throw new ResourceNotFoundException("No recipes found producing item: " + itemName);
        }
        return recipes;
    }

    public Recipe getDefaultByItemName(String itemName) {
        return recipeRepository
                .findFirstByItemToBuild_NameIgnoreCaseAndIsAlternateFalse(itemName)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Default recipe not found for item: " + itemName));
    }

    public Recipe create(RecipeDto dto) {
        // Resolve output item
        Item output = itemRepository.findById(dto.getItemToBuild().getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Output item not found: " + dto.getItemToBuild().getId()));

        // If default, ensure no existing default
        if (!dto.isAlternate()) {
            boolean existsDefault = recipeRepository
                    .findFirstByItemToBuild_NameIgnoreCaseAndIsAlternateFalse(output.getName())
                    .isPresent();
            if (existsDefault) {
                throw new BadRequestException(
                        "A default recipe already exists for item: " + output.getName());
            }
        }

        // Resolve building
        Building building = buildingRepository
                .findByType(dto.getBuilding())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Building not found: " + dto.getBuilding()));

        // Resolve ingredients
        List<Item> inputs = dto.getItems().stream()
                .map(i -> itemRepository.findById(i.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Ingredient not found: " + i.getId())))
                .collect(Collectors.toList());

        // Resolve by-product if any
        Item byProd = null;
        if (dto.isHasByProduct()) {
            byProd = itemRepository.findById(dto.getByProduct().getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "By-product item not found: " + dto.getByProduct().getId()));
        }

        // Build and save
        Recipe toSave = new Recipe();
        toSave.setAlternate(dto.isAlternate());
        toSave.setSpaceElevator(dto.isSpaceElevator());
        toSave.setFuel(dto.isFuel());
        toSave.setWeaponOrTool(dto.isWeaponOrTool());
        toSave.setHasByProduct(dto.isHasByProduct());
        toSave.setTier(dto.getTier());
        toSave.setBuilding(building);
        toSave.setItemToBuild(output);
        toSave.setItems(inputs);
        toSave.setByProduct(byProd);

        return recipeRepository.save(toSave);
    }

    public Recipe update(Long id, RecipeDto dto) {
        Recipe existing = findById(id);

        // If toggling to default, ensure uniqueness
        if (!dto.isAlternate() && existing.isAlternate()) {
            boolean existsDefault = recipeRepository
                    .findFirstByItemToBuild_NameIgnoreCaseAndIsAlternateFalse(
                            existing.getItemToBuild().getName())
                    .filter(r -> !r.getId().equals(id))
                    .isPresent();
            if (existsDefault) {
                throw new BadRequestException(
                        "Another default recipe already exists for item: "
                                + existing.getItemToBuild().getName());
            }
        }

        // Update flags & tier
        existing.setAlternate(dto.isAlternate());
        existing.setSpaceElevator(dto.isSpaceElevator());
        existing.setFuel(dto.isFuel());
        existing.setWeaponOrTool(dto.isWeaponOrTool());
        existing.setHasByProduct(dto.isHasByProduct());
        existing.setTier(dto.getTier());

        // Update building if changed
        if (dto.getBuilding() != existing.getBuilding().getType()) {
            Building building = buildingRepository
                    .findByType(dto.getBuilding())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Building not found: " + dto.getBuilding()));
            existing.setBuilding(building);
        }

        // Update inputs
        List<Item> inputs = dto.getItems().stream()
                .map(i -> itemRepository.findById(i.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Ingredient not found: " + i.getId())))
                .collect(Collectors.toList());
        existing.setItems(inputs);

        // Update by-product
        if (dto.isHasByProduct()) {
            Item byProd = itemRepository.findById(dto.getByProduct().getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "By-product item not found: " + dto.getByProduct().getId()));
            existing.setByProduct(byProd);
        } else {
            existing.setByProduct(null);
        }

        return recipeRepository.save(existing);
    }

    public void delete(Long id) {
        Recipe existing = findById(id);
        recipeRepository.delete(existing);
    }
}
