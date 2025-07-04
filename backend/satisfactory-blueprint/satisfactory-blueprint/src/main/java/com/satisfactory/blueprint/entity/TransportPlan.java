package com.satisfactory.blueprint.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transport_plans")
@Data
public class TransportPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Descriptive name for this transport plan */
    @Column(nullable = false)
    private String name;

    /** The factory plan this transport plan supports */
    @ManyToOne(optional = false)
    @JoinColumn(name = "source_planner_id", nullable = false)
    private Planner sourcePlanner;

    /**
     * The list of routes in this transport plan (e.g., a train route, truck route).
     * Cascade and orphanRemoval keep this in sync with the plan.
     */
    @OneToMany(mappedBy = "transportPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransportRoute> routes = new ArrayList<>();
}
