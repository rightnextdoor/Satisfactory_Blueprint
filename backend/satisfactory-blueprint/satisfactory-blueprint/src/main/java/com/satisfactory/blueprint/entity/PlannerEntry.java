package com.satisfactory.blueprint.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "planner_entries",
        uniqueConstraints = @UniqueConstraint(
                name = "uc_planner_recipe",
                columnNames = { "planner_id", "recipe_id" }
        )
)
@Data
public class PlannerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The plan this entry belongs to */
    @ManyToOne(optional = false)
    @JoinColumn(name = "planner_id", nullable = false)
    private Planner planner;

    /** The recipe used to produce an item */
    @ManyToOne(optional = false)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    /** Number of buildings running this recipe */
    @Column(nullable = false)
    private int buildingCount;

    /** Manual outgoing target (items/minute) to sinks like home base */
    @Column(nullable = false)
    private double outgoingAmountPerMinute = 0.0;

    /**
     * If true, user explicitly chose this recipe;
     * auto-expansion logic should not overwrite it.
     */
    @Column(nullable = false)
    private boolean isRecipeManuallySelected = false;

    /** How this output is allocated to consumers or external sinks */
    @OneToMany(mappedBy = "sourceEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlannerAllocation> allocations = new ArrayList<>();
}
