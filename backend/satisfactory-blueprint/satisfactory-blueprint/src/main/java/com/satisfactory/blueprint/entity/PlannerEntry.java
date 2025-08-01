package com.satisfactory.blueprint.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.entity.Planner;
import com.satisfactory.blueprint.entity.Recipe;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.entity.embedded.PlannerAllocation;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="planner_entries")
@Data
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class PlannerEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "planner_id", nullable = false)
    @JsonBackReference
    private Planner planner;


    /** which recipe this entry represents */
    @ManyToOne(optional = false)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    /**
     * the item this entry produces (== recipe.getItemToBuild().getItem())
     * immutable once set: updatable = false
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_item_id", nullable = false, updatable = false)
    private Item targetItem;

    /** how many buildings running this recipe (always > 0, default 1) */
    @Column(name = "building_count", nullable = false)
    private double buildingCount = 1.0;

    /** outgoing per-minute = recipe.getItemToBuild().getAmount() * buildingCount */
    @Column(name = "outgoing_amount", nullable = false)
    private double outgoingAmount;

    @Column(name="overclock_building", precision=7, scale=4, nullable=true)
    private BigDecimal overclockBuilding;

    @Column(name = "power_consumption", precision = 12, scale = 4, nullable = true)
    private BigDecimal powerConsumption;

    /** per-building ingredients snapshot */
    @ElementCollection
    @CollectionTable(
                 name = "planner_entry_ingredients",
                 joinColumns = @JoinColumn(name = "entry_id", nullable = false)
             )
    @AssociationOverride(
            name = "item",
            joinColumns = @JoinColumn(name = "ingredient_item_id", nullable = false)
    )
    @AttributeOverride(
            name = "amount",
            column = @Column(name = "ingredient_amount", nullable = false)
    )
    private List<ItemData> ingredientAllocations = new ArrayList<>();

    /** who (other entries) need this output — their demands on this entry */
    @ElementCollection
    @CollectionTable(
                 name = "planner_entry_recipe_allocations",
                 joinColumns = @JoinColumn(name = "entry_id", nullable = false)
             )
    private List<PlannerAllocation> recipeAllocations = new ArrayList<>();

    /** user‐entered “I want X to Home base” allocations */
    @ElementCollection
    @CollectionTable(
                 name = "planner_entry_manual_allocations",
                 joinColumns = @JoinColumn(name = "entry_id", nullable = false)
             )
    private List<PlannerAllocation> manualAllocations = new ArrayList<>();

    @Transient
    private boolean buildingOverride = false;

    public boolean isBuildingOverride() {
        return buildingOverride;
    }
    public void setBuildingOverride(boolean buildingOverride) {
        this.buildingOverride = buildingOverride;
    }
}
