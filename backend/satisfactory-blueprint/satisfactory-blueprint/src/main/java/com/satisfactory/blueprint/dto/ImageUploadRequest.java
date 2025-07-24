package com.satisfactory.blueprint.dto;

import com.satisfactory.blueprint.entity.enums.OwnerType;
import lombok.Data;

import java.util.UUID;

@Data
public class ImageUploadRequest {
    private UUID id;
    private String contentType;
    private String data;
    private UUID oldImageId;
    private OwnerType ownerType;
    private Long ownerId;

}
