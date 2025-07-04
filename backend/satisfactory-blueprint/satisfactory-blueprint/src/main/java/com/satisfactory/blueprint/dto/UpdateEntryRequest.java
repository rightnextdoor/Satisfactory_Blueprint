package com.satisfactory.blueprint.dto;

import lombok.Data;

/**
 * Request DTO for updating an existing recipe entry in a planner.
 */
@Data
public class UpdateEntryRequest {
    private Long entryId;
    private Integer buildingCount;           // nullable
    private Double outgoingAmountPerMinute;  // nullable
    private Long newRecipeId;                // nullable, to switch recipe if needed
}
