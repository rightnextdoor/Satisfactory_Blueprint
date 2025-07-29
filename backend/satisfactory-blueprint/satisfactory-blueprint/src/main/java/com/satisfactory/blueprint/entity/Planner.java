package com.satisfactory.blueprint.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.entity.enums.PlannerMode;
import com.satisfactory.blueprint.entity.enums.PlannerTargetType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "planners")
@Data
public class Planner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** A user‐friendly name for this plan */
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlannerMode mode;
    /**
     * Mode: are we targeting a particular GENERATOR (and its fuel)
     * or a raw FUEL output?
     */
    @Enumerated(EnumType.STRING)
    private PlannerTargetType targetType;

    /**
     * When in FUEL‐GENERATOR mode, which generator to use.
     * Otherwise null.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "generator_id")
    private Generator generator;

    /**
     * The “target amount” the user entered: either
     * # of generators, or amount of fuel per minute.
     */
    private Double targetAmount;

    @Embedded
    @AssociationOverride(
            name = "item",
            joinColumns = @JoinColumn(name = "target_item_id", nullable = true)
    )
    @AttributeOverride(
            name = "amount",
            column = @Column(name = "by_product_amount", nullable = true)
    )
    private ItemData targetItem;

    private Double generatorBuildingCount;

    /** When this plan was first created */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** Last time any entry/allocation changed */
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * All of the embedded entries (one per recipe/item),
     * each with its own allocations and building counts.
     */
    @OneToMany(
            mappedBy = "planner",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<PlannerEntry> entries = new ArrayList<>();

    /**
     * A deduplicated list of “resource” items needed by
     * this entire plan, with their total per-minute amounts.
     */
    @ElementCollection
    @CollectionTable(
            name = "planner_resources",
            joinColumns = @JoinColumn(name = "planner_id")
    )
    @AssociationOverride(
            name = "item",
            joinColumns = @JoinColumn(name = "item_id", nullable = false)
    )
    @AttributeOverride(
            name = "amount",
            column = @Column(name = "amount", nullable = false)
    )
    private List<ItemData> resources = new ArrayList<>();
}
