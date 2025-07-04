package com.satisfactory.blueprint.dto;

import lombok.Data;

/**
 * DTO for creating, updating, and deleting transport items within a route.
 */
@Data
public class TransportItemDto {
    private Long id;

    /** ID of the route this item belongs to */
    private Long routeId;

    /** ID of the item being transported */
    private Long itemId;

    /** Amount of this item to transport, in units per minute */
    private double amountPerMinute;

    /** Optional index of the car (or trailer) this item is loaded into */
    private Integer carSlot;
}
