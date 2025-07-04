package com.satisfactory.blueprint.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "transport_items")
@Data
public class TransportItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The route this item assignment belongs to */
    @ManyToOne(optional = false)
    @JoinColumn(name = "route_id", nullable = false)
    private TransportRoute route;

    /** The item being transported */
    @ManyToOne(optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    /** Amount of this item to transport, in units per minute */
    @Column(nullable = false)
    private double amountPerMinute;

    /**
     * Optional index of the car (or trailer) this item is loaded into.
     * If null, allocation to cars is handled by the UI logic.
     */
    @Column(nullable = true)
    private Integer carSlot;
}
