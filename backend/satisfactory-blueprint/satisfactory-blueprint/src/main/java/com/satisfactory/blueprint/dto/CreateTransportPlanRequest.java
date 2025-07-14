package com.satisfactory.blueprint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransportPlanRequest {
    private String name;
    private Long plannerId;
    private boolean addAllResources;
    private List<TransportItemRequestDto> transportItems;
}