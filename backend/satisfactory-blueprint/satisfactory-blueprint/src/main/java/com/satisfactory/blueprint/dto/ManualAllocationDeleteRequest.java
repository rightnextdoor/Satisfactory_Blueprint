package com.satisfactory.blueprint.dto;

import lombok.Data;

@Data
public class ManualAllocationDeleteRequest {
    private Long plannerId;
    private Long entryId;
    private String label;
}
