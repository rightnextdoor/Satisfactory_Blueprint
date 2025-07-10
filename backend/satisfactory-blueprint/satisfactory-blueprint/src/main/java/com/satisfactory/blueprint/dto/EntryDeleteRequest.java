package com.satisfactory.blueprint.dto;

import lombok.Data;

@Data
public class EntryDeleteRequest {
    private Long plannerId;
    private Long entryId;
}