package com.satisfactory.blueprint.entity;

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

    /** Human-readable plan name */
    @Column(nullable = false)
    private String name;

    /** True if this plan is focused on fuel/power generation */
    @Column(nullable = false)
    private boolean isFuelFactory;

    /** When the plan was first created */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** Last time the plan was modified */
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * All recipe entries in this plan.
     * Cascade ensures entries are persisted/removed with the plan.
     */
    @OneToMany(mappedBy = "planner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlannerEntry> entries = new ArrayList<>();
}
