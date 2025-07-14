package com.satisfactory.blueprint.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.satisfactory.blueprint.config.CustomDoubleSerializer;
import lombok.Data;

@Data
public class ResourcesDto {
    private ItemDto item;
    @JsonSerialize(using = CustomDoubleSerializer.class)
    private double amount;
}
