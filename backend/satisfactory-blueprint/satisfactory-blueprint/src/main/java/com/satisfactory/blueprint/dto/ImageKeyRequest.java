package com.satisfactory.blueprint.dto;

import lombok.Data;

/**
 * Request DTO for operations that need just an image key.
 */
@Data
public class ImageKeyRequest {
    private String key;
}