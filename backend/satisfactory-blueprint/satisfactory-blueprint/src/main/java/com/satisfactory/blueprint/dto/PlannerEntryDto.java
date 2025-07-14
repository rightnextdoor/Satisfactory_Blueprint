package com.satisfactory.blueprint.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.satisfactory.blueprint.config.CustomDoubleSerializer;
import com.satisfactory.blueprint.entity.Recipe;
import lombok.Data;

import java.util.List;

/**
 * DTO for a single embedded entry in a Planner.
 */
@Data
public class PlannerEntryDto {
    private Long id;
    private RecipeDto recipe;

    /**
     * The “target item” label (always matches the recipe’s output item name).
     */
    private ItemDto targetItem;

    /**
     * How many buildings are required for this recipe entry. Must be > 0.
     */
    @JsonSerialize(using = CustomDoubleSerializer.class)
    private Double buildingCount;
    private Boolean buildingOverride;

    /**
     * The outgoing rate (items/min) for this entry. Changing this will
     * re-calculate buildingCount.
     */
    @JsonSerialize(using = CustomDoubleSerializer.class)
    private double outgoingAmount;

    /**
     * Allocations coming from other recipe entries that consume this entry’s output.
     */
    private List<PlannerAllocationDto> recipeAllocations;

    /**
     * User-defined allocations (e.g. “send 45 to Home Base”) that also affect buildingCount.
     */
    private List<PlannerAllocationDto> manualAllocations;

    /**
     * The ingredient list for this recipe (always matches the recipe’s ingredient rates).
     */
    private List<PlannerAllocationDto> ingredientAllocations;
}
