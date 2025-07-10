package com.satisfactory.blueprint.dto;

import com.satisfactory.blueprint.entity.enums.BuildingType;
import lombok.Data;

import java.util.List;

@Data
public class RecipeDto {
    private Long id;
    private boolean alternate;
    private boolean spaceElevator;
    private boolean fuel;
    private boolean weaponOrTool;
    private boolean hasByProduct;
    private int tier;
    private BuildingType building;
    private ItemDataDto itemToBuild;
    private List<ItemDataDto> items;
    private ItemDataDto byProduct;
}
