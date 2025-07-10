package com.satisfactory.blueprint.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "items")
@Data
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Human-readable name, e.g. “Iron Ore” or “Reinforced Iron Plate”
     */
    @Column(nullable = false, unique = true)
    private String name;

    /**
     * Key into the Image table (e.g. “iron-ore.png” or UUID string).
     * The frontend will request /api/images/get with this key.
     */
    @Column(nullable = true)
    private String iconKey;

    /**
     * True if this is a raw resource (mined, harvested), false if it’s a crafted item.
     */
    @Column(nullable = false)
    private boolean resource;
}
