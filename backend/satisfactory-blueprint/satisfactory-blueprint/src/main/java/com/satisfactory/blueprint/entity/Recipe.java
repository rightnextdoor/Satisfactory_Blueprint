package com.satisfactory.blueprint.entity;

import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.entity.enums.BuildingType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "recipes")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private boolean alternate;

    @Column(nullable = false)
    private boolean spaceElevator;

    @Column(nullable = false)
    private boolean fuel;

    @Column(nullable = false)
    private boolean weaponOrTool;

    @Column(nullable = false)
    private boolean hasByProduct;

    @Column(nullable = false)
    private int tier;

    @ManyToOne(optional = true)
    @JoinColumn(name = "building_id", nullable = true)
    private Building building;

    @Embedded
    @AssociationOverride(
            name = "item",
            joinColumns = @JoinColumn(name = "item_to_build_id", nullable = false)
    )
    @AttributeOverride(
            name = "amount",
            column = @Column(name = "item_to_build_amount", nullable = false)
    )
    private ItemData itemToBuild;

    @ElementCollection
    @CollectionTable(
            name = "recipe_items",
            joinColumns = @JoinColumn(name = "recipe_id")
    )
    @AssociationOverride(
            name = "item",
            joinColumns = @JoinColumn(name = "item_id", nullable = false)
    )
    @AttributeOverride(
            name = "amount",
            column = @Column(name = "amount", nullable = false)
    )
    private List<ItemData> items = new ArrayList<>();


    @Embedded
    @AssociationOverride(
            name = "item",
            joinColumns = @JoinColumn(name = "by_product_id")
    )
    @AttributeOverride(
            name = "amount",
            column = @Column(name = "by_product_amount")
    )
    private ItemData byProduct;
}
