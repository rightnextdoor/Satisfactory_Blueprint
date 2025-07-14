package com.satisfactory.blueprint.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.satisfactory.blueprint.config.CustomDoubleSerializer;
import lombok.Data;

/**
 * DTO for a single allocation in a PlannerEntry.
 * Can represent:
 *   – recipeAllocations: other entries consuming this output
 *   – manualAllocations: user‐defined pulls
 *   – ingredientAllocations: this recipe’s inputs
 */
@Data
public class PlannerAllocationDto {
    private ItemDto item;
    private String label;

    /**
     * The per‐minute amount for this allocation.
     * Manual allocations can change this; recipe allocations are fixed.
     */
    @JsonSerialize(using = CustomDoubleSerializer.class)
    private double amount;

    /**
     * How many buildings this allocation drives.
     * Both recipe and manual allocations contribute to entry.buildingCount.
     */
    @JsonSerialize(using = CustomDoubleSerializer.class)
    private double buildingCount;

}
