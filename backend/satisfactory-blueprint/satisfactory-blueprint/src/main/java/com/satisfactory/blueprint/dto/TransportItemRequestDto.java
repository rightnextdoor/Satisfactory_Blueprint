package com.satisfactory.blueprint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportItemRequestDto {
    private Long itemId;
    private Double targetQuantity;
}
