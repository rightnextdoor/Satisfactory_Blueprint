package com.satisfactory.blueprint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportPlanDto {
    private Long id;
    private String name;
    private Long plannerId;
    private List<TransportItemDto> transportItems;
    private List<TransportRouteDto> routes;
}