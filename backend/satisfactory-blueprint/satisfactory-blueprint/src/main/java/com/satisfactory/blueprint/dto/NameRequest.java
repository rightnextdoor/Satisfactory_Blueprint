package com.satisfactory.blueprint.dto;

import lombok.Data;

/**
 * Generic request DTO for endpoints that require a name in the request body.
 */
@Data
public class NameRequest {
    private String name;
}
