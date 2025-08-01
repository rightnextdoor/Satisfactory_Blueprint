package com.satisfactory.blueprint.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.satisfactory.blueprint.config.CustomDoubleSerializer;
import com.satisfactory.blueprint.entity.enums.PlannerMode;
import com.satisfactory.blueprint.entity.enums.PlannerTargetType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

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
    @JsonSerialize(using = CustomDoubleSerializer.class)
    private Double targetAmount;

    @JsonSerialize(using = CustomDoubleSerializer.class)
    private Double burnTime;

    private ItemDataDto targetItem;
    @JsonSerialize(using = CustomDoubleSerializer.class)
    private Double generatorBuildingCount;

    @JsonSerialize(using = CustomDoubleSerializer.class)
    private Double overclockGenerator;

    @JsonSerialize(using = CustomDoubleSerializer.class)
    private Double totalPowerConsumption;

    @JsonSerialize(using = CustomDoubleSerializer.class)
    private Double totalGeneratorPower;

    /** Audit fields */
    private Instant createdAt;
    private Instant updatedAt;

    /** The expanded tree of entries */
    private List<PlannerEntryDto> entries;

    /** The raw‐resource totals */
    private List<ResourcesDto> resources;
}
