package com.satisfactory.blueprint.dto;

import lombok.Data;

@Data
public class PlannerAllocationDto {
    private Long id;
    private Long consumerEntryId;   // null if an external sink
    private String consumerLabel;   // e.g. "Home Base"
    private double allocatedAmount; // items per minute
}
