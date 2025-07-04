package com.satisfactory.blueprint.dto;

import com.satisfactory.blueprint.entity.enums.BuildingType;
import lombok.Data;

import java.util.List;

@Data
public class RecipeDto {
    private Long id;
    private boolean isAlternate;
    private boolean isSpaceElevator;
    private boolean isFuel;
    private boolean isWeaponOrTool;
    private boolean hasByProduct;
    private int tier;
    private BuildingType building;
    private ItemDto itemToBuild;
    private List<ItemDto> items;
    private ItemDto byProduct;  // nullable
}
