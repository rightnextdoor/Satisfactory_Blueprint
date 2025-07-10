package com.satisfactory.blueprint.dto;

import lombok.Data;

@Data
public class ManualAllocationRequest {
    private Long plannerId;
    private Long entryId;
    private PlannerAllocationDto manualAllocationDto;
}
