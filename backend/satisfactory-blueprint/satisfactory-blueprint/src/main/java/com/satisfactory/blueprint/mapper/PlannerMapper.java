package com.satisfactory.blueprint.mapper;

import com.satisfactory.blueprint.dto.*;
import com.satisfactory.blueprint.entity.Generator;
import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.entity.Planner;
import com.satisfactory.blueprint.entity.PlannerEntry;
import com.satisfactory.blueprint.entity.Recipe;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.entity.embedded.PlannerAllocation;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlannerMapper {

    public PlannerDto toDto(Planner planner) {
        PlannerDto dto = new PlannerDto();
        dto.setId(planner.getId());
        dto.setName(planner.getName());
        dto.setMode(planner.getMode());
        dto.setTargetType(planner.getTargetType());
        dto.setTargetAmount(planner.getTargetAmount());

        dto.setCreatedAt(planner.getCreatedAt()
                .atZone(ZoneOffset.UTC)
                .toInstant());
        dto.setUpdatedAt(planner.getUpdatedAt()
                .atZone(ZoneOffset.UTC)
                .toInstant());

        dto.setGenerator(mapGenerator(planner.getGenerator()));

        dto.setResources(
                planner.getResources().stream()
                        .map(this::mapResource)      // ← use ResourcesDto now
                        .collect(Collectors.toList())
        );

        List<PlannerEntryDto> entries = planner.getEntries().stream()
                .map(this::mapPlannerEntry)
                .collect(Collectors.toList());
        dto.setEntries(entries);

        return dto;
    }

    private ResourcesDto mapResource(ItemData resourceData) {
        ResourcesDto resourceDto = new ResourcesDto();
        resourceDto.setItem( mapItem(resourceData.getItem()) );
        resourceDto.setAmount( resourceData.getAmount() );
        return resourceDto;
    }

    private GeneratorDto mapGenerator(Generator generator) {
        if (generator == null) {
            return null;
        }
        GeneratorDto dto = new GeneratorDto();
        dto.setId(generator.getId());
        dto.setName(generator.getName());
        dto.setFuelType(generator.getFuelType());
        dto.setBurnTime(generator.getBurnTime());
        dto.setPowerOutput(generator.getPowerOutput());
        dto.setIconKey(generator.getIconKey());
        dto.setHasByProduct(generator.isHasByProduct());

        if (generator.getByProduct() != null) {
            dto.setByProduct(mapItemData(generator.getByProduct()));
        }

        List<ItemDataDto> fuelOptions = generator.getFuelItems().stream()
                .map(this::mapItemData)
                .collect(Collectors.toList());
        dto.setFuelItems(fuelOptions);

        return dto;
    }

    private PlannerEntryDto mapPlannerEntry(PlannerEntry entry) {
        PlannerEntryDto dto = new PlannerEntryDto();
        dto.setId(entry.getId());
        dto.setTargetItem(mapItem(entry.getTargetItem()));
        dto.setRecipe(mapRecipe(entry.getRecipe()));
        dto.setBuildingCount(entry.getBuildingCount());
        dto.setOutgoingAmount(entry.getOutgoingAmount());

        dto.setIngredientAllocations(
                entry.getIngredientAllocations().stream()
                        .map(this::mapIngredientAllocation)
                        .collect(Collectors.toList())
        );

        dto.setRecipeAllocations(
                entry.getRecipeAllocations().stream()
                        .map(this::mapPlannerAllocation)
                        .collect(Collectors.toList())
        );

        dto.setManualAllocations(
                entry.getManualAllocations().stream()
                        .map(this::mapPlannerAllocation)
                        .collect(Collectors.toList())
        );

        return dto;
    }

    private RecipeDto mapRecipe(Recipe recipe) {
        if (recipe == null) {
            return null;
        }
        RecipeDto dto = new RecipeDto();
        dto.setId(recipe.getId());
        dto.setAlternate(recipe.isAlternate());
        dto.setFuel(recipe.isFuel());
        dto.setHasByProduct(recipe.isHasByProduct());
        dto.setSpaceElevator(recipe.isSpaceElevator());
        dto.setWeaponOrTool(recipe.isWeaponOrTool());
        dto.setTier(recipe.getTier());
        dto.setBuilding(recipe.getBuilding().getType());

        dto.setItemToBuild(mapItemData(recipe.getItemToBuild()));
        dto.setItems(
                recipe.getItems().stream()
                        .map(this::mapItemData)
                        .collect(Collectors.toList())
        );

        if (recipe.getByProduct() != null) {
            dto.setByProduct(mapItemData(recipe.getByProduct()));
        }

        return dto;
    }

    private ItemDto mapItem(Item item) {
        if (item == null) {
            return null;
        }
        ItemDto dto = new ItemDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setIconKey(item.getIconKey());
        dto.setResource(item.isResource());
        return dto;
    }

    private ItemDataDto mapItemData(ItemData itemData) {
        ItemDataDto dto = new ItemDataDto();
        dto.setItem(mapItem(itemData.getItem()));
        dto.setAmount(itemData.getAmount());
        return dto;
    }

    private PlannerAllocationDto mapPlannerAllocation(PlannerAllocation allocation) {
        PlannerAllocationDto dto = new PlannerAllocationDto();
        dto.setLabel(allocation.getLabel());
        dto.setAmount(allocation.getAmount());
        dto.setBuildingCount(allocation.getBuildingCount());

        // guard against null item (e.g. generator fuel allocation)
        if (allocation.getItem() != null) {
            dto.setItem(mapItem(allocation.getItem()));
        } else {
            dto.setItem(null);
        }

        return dto;
    }

    private PlannerAllocationDto mapIngredientAllocation(ItemData ingredient) {
        PlannerAllocationDto dto = new PlannerAllocationDto();
        dto.setLabel(ingredient.getItem().getName());
        dto.setAmount(ingredient.getAmount());
        dto.setBuildingCount(0);
        dto.setItem(mapItem(ingredient.getItem()));
        return dto;
    }
}
