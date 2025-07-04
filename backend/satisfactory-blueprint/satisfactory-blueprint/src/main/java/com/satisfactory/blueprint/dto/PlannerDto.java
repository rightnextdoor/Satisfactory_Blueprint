package com.satisfactory.blueprint.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PlannerDto {
    private Long id;
    private String name;
    private boolean isFuelFactory;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<PlannerEntryDto> entries;
}
