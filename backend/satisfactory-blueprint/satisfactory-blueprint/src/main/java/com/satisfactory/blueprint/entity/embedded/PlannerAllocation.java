package com.satisfactory.blueprint.entity.embedded;

import com.satisfactory.blueprint.entity.Item;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Embeddable
public class PlannerAllocation {

    /**
     * If this is a recipe‐driven allocation, point at the actual Item entity.
     * If it’s a manual allocation, you can leave this null and just use `label`.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private Item item;

    /**
     * Fallback human‐readable label.
     * For recipe allocations defaults to item.getName(), for manual you set whatever you like.
     */
    @Column(name = "allocation_label")
    private String label;

    /** items per minute needed */
    @Column(name = "allocation_amount", nullable = false)
    private double amount;

    /** how many buildings to satisfy that amount */
    @Column(name = "allocation_buildings", nullable = false)
    private double buildingCount;
}
