package com.satisfactory.blueprint.dto;

import lombok.Data;

import java.util.List;

@Data
public class PlannerEntryDto {
    private Long id;
    private RecipeDto recipe;
    private int buildingCount;
    private double outgoingAmountPerMinute;
    private boolean isRecipeManuallySelected;
    private List<PlannerAllocationDto> allocations;
}
