package com.satisfactory.blueprint.dto;

import lombok.Data;

/**
 * Encapsulates an Item plus the quantity for fuel or by-product.
 */
@Data
public class ItemDataDto {
    private ItemDto item;
    private double amount;
}
