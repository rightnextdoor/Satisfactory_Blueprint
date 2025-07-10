package com.satisfactory.blueprint.dto;

import com.satisfactory.blueprint.entity.enums.GeneratorType;
import com.satisfactory.blueprint.entity.enums.PlannerMode;
import com.satisfactory.blueprint.entity.enums.PlannerTargetType;
import lombok.Data;

import java.util.List;

/**
 * DTO for creating or updating a Planner.
 */
@Data
public class PlannerDto {
    /** Set for update; leave null on create. */
    private Long id;

    /** A user‐friendly name for this plan. */
    private String name;

    /** Factory vs. fuel mode. */
    private PlannerMode mode;

    /** Are we targeting a GENERATOR (and its fuel) or a raw FUEL output? */
    private PlannerTargetType targetType;

    private GeneratorDto generator;

    /** The user’s “target amount”: either number of generators or amount of fuel/min. */
    private Double targetAmount;
    private List<PlannerEntryDto> entries;
    private List<ItemDataDto> resources;
}
