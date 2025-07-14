package com.satisfactory.blueprint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartAllocationDto {
    private Integer cartIndex;
    private Long itemId;
    private Double cartCapacity;
    private Double loadedQuantity;
}
