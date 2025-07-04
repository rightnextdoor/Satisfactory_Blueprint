package com.satisfactory.blueprint.dto;

import lombok.Data;

/**
 * Request DTO for adding a new recipe entry to a planner.
 */
@Data
public class AddEntryRequest {
    private Long plannerId;
    private Long recipeId;
    private int buildingCount;
}
