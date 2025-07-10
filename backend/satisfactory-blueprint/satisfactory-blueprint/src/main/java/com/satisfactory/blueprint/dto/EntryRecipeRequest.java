package com.satisfactory.blueprint.dto;

import lombok.Data;

@Data
public class EntryRecipeRequest {
    private Long plannerId;
    private PlannerEntryDto entryDto;
}