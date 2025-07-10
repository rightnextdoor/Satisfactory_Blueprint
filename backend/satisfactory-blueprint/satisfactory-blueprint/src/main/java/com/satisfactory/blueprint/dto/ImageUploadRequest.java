package com.satisfactory.blueprint.dto;

import lombok.Data;

/**
 * Payload for uploading an image:
 * - key: the user‐chosen identifier (e.g. "iron‐ore")
 * - contentType: MIME type ("image/png")
 * - data: base64‐encoded image bytes
 */
@Data
public class ImageUploadRequest {
    private String key;
    private String contentType;
    private String data;
}
