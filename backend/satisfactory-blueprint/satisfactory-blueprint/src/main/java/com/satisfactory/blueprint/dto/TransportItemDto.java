package com.satisfactory.blueprint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportItemDto {
    private ItemDto item;
    private Double targetQuantity;
    private Double coveredQuantity;
    private Double remainingQuantity;
}