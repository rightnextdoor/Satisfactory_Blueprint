package com.satisfactory.blueprint.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.entity.enums.GeneratorType;
import com.satisfactory.blueprint.entity.enums.FuelType;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "generators")
@Data
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Generator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The type of generator (e.g. BIOMASS_BURNER, FUEL_GENERATOR, etc.).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GeneratorType name;

    /**
     * The category of fuel this generator accepts.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FuelType fuelType;

    /**
     * True if running this generator produces a by-product.
     */
    @Column(nullable = false)
    private boolean hasByProduct;

    /**
     * The by-product item (e.g. Heavy Oil Residue), if any.
     */
    @Embedded
    @AssociationOverride(
            name = "item",
            joinColumns = @JoinColumn(name = "by_product_id", nullable = true)
    )
    @AttributeOverride(
            name = "amount",
            column = @Column(name = "by_product_amount", nullable = true)
    )
    private ItemData byProduct;

    /**
     * Power output in megawatts.
     */
    @Column(nullable = false)
    private double powerOutput;

    /**
     * Burn time in seconds per unit of fuel.
     */
    @Column(nullable = false)
    private double burnTime;

    /**
     * The list of items that can be used as fuel for this generator.
     */
    @ElementCollection
    @CollectionTable(
            name = "generator_fuel_items",
            joinColumns = @JoinColumn(name = "generator_id")
    )
    @AssociationOverride(
            name = "item",
            joinColumns = @JoinColumn(name = "item_id", nullable = false)
    )
    @AttributeOverride(
            name = "amount",
            column = @Column(name = "amount", nullable = false)
    )
    private List<ItemData> fuelItems = new ArrayList<>();

    /**
     * Optional icon key for the frontend to fetch via the Image service.
     */
    @Column(nullable = true)
    private String iconKey;
}
