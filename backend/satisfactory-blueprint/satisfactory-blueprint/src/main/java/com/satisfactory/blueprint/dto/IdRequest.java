package com.satisfactory.blueprint.dto;

import lombok.Data;

/**
 * Generic request DTO for endpoints that require only an ID in the request body.
 */
@Data
public class IdRequest {
    private Long id;
}
