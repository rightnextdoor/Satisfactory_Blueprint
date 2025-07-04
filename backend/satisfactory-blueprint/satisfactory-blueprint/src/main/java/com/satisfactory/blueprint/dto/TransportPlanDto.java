package com.satisfactory.blueprint.dto;

import lombok.Data;
import java.util.List;

@Data
public class TransportPlanDto {
    private Long id;
    private String name;
    private Long sourcePlannerId;
    private List<TransportRouteDto> routes;
}
