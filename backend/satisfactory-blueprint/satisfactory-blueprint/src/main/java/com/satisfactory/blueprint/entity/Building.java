package com.satisfactory.blueprint.entity;

import com.satisfactory.blueprint.entity.enums.BuildingType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "buildings")
@Data
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Type of building (e.g. SMELTER, CONSTRUCTOR, etc.).
     * Must be unique.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private BuildingType type;

    /**
     * Sort order index for front-end display (lower values appear first).
     */
    @Column(nullable = false)
    private int sortOrder;

    /**
     * Base power usage in megawatts, editable by the user.
     */
    @Column(nullable = false)
    private double powerUsage;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "image_id", foreignKey = @ForeignKey(name = "fk_building_image"))
    private Image image;
}
