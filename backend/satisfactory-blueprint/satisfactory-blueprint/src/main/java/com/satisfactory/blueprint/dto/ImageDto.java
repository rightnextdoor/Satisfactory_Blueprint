package com.satisfactory.blueprint.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.satisfactory.blueprint.entity.enums.OwnerType;
import lombok.Data;

import java.util.UUID;

@Data
public class ImageDto {
    private UUID id;
    private String contentType;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private byte[] data;
}
