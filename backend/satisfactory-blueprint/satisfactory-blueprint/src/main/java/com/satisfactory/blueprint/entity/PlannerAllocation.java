package com.satisfactory.blueprint.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "planner_allocations")
@Data
public class PlannerAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The source entry producing items (e.g., Iron Ingot producer).
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "source_entry_id", nullable = false)
    private PlannerEntry sourceEntry;

    /**
     * The consuming entry that uses this output (e.g., Iron Plate constructor).
     * If null and a label is provided, it’s an external sink.
     */
    @ManyToOne
    @JoinColumn(name = "consumer_entry_id", nullable = true)
    private PlannerEntry consumerEntry;

    /**
     * Label for external sinks or custom consumers
     * (e.g., "Home Base", "Storage Silo").
     */
    @Column(nullable = true)
    private String consumerLabel;

    /**
     * Amount of items per minute allocated to this consumer.
     */
    @Column(nullable = false)
    private double allocatedAmount;
}
