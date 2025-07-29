package com.satisfactory.blueprint.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "items")
@Data
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Human-readable name, e.g. “Iron Ore” or “Reinforced Iron Plate”
     */
    @Column(nullable = false, unique = true)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "image_id", foreignKey = @ForeignKey(name = "fk_item_image"))
    private Image image;

    /**
     * True if this is a raw resource (mined, harvested), false if it’s a crafted item.
     */
    @Column(nullable = false)
    private boolean resource;
}
