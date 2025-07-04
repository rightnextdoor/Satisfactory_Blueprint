package com.satisfactory.blueprint.dto;

import com.satisfactory.blueprint.entity.enums.BuildingType;
import lombok.Data;

@Data
public class BuildingDto {
    private Long id;
    private BuildingType type;
    private int sortOrder;
    private double powerUsage;
    private String iconKey;   // nullable
}
