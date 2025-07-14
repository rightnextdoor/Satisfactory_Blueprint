package com.satisfactory.blueprint.entity;

import com.satisfactory.blueprint.entity.embedded.TransportItem;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transport_plans")
public class TransportPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** User-defined name for this transport plan */
    private String name;

    /** Optional reference to an existing Planner */
    private Long plannerId;

    /** Items to transport (imported or manual) */
    @ElementCollection
    @CollectionTable(
            name = "plan_items",
            joinColumns = @JoinColumn(name = "plan_id")
    )
    private List<TransportItem> transportItems = new ArrayList<>();

    /** Routes (stations) under this plan */
    @OneToMany(mappedBy = "transportPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransportRoute> routes = new ArrayList<>();
}
