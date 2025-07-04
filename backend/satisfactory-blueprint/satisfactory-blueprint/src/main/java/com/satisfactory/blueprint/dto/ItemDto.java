package com.satisfactory.blueprint.dto;

import lombok.Data;

@Data
public class ItemDto {
    private Long id;
    private String name;
    private String iconKey;    // matches Item.iconKey, nullable
    private double amount;
    private boolean isResource;
}
