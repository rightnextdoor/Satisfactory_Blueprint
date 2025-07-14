package com.satisfactory.blueprint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic request DTO for endpoints that require only an ID in the request body.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdRequest {
    private Long id;
}
