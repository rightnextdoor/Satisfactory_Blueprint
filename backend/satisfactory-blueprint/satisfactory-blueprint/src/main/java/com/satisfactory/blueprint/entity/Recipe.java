package com.satisfactory.blueprint.entity;

import com.satisfactory.blueprint.entity.enums.BuildingType;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "recipes")
@Data
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** True if this is an alternate recipe */
    @Column(nullable = false)
    private boolean isAlternate;

    /** True if used for the Space Elevator */
    @Column(nullable = false)
    private boolean isSpaceElevator;

    /** True if this recipe produces fuel */
    @Column(nullable = false)
    private boolean isFuel;

    /** True if this recipe produces weapons or tools */
    @Column(nullable = false)
    private boolean isWeaponOrTool;

    /** True if this recipe has a by-product */
    @Column(nullable = false)
    private boolean hasByProduct;

    /** Tier level for sorting/filtering in the planner */
    @Column(nullable = false)
    private int tier;

    /** Which building produces this recipe */
    @ManyToOne(optional = false)
    @JoinColumn(name = "building_id")
    private Building building;

    /** The item that this recipe outputs */
    @ManyToOne(optional = false)
    @JoinColumn(name = "item_to_build_id")
    private Item itemToBuild;

    /** Ingredients (items) required by this recipe; their `amount` field indicates qty */
    @ManyToMany
    @JoinTable(
            name = "recipe_items",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<Item> items;

    /** Optional by-product item; its `amount` field indicates qty */
    @ManyToOne
    @JoinColumn(name = "by_product_id", nullable = true)
    private Item byProduct;
}
