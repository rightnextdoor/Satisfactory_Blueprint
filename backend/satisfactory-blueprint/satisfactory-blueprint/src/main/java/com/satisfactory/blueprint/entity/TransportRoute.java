package com.satisfactory.blueprint.entity;

import com.satisfactory.blueprint.entity.embedded.CartAllocation;
import com.satisfactory.blueprint.entity.enums.VehicleType;
import com.satisfactory.blueprint.entity.enums.FuelType;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transport_routes")
@Data
public class TransportRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** User-defined station name, e.g. "Train Station 1" */
    private String stationName;

    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    /** For truck/plane: capacity and single load assignment */
    private Double capacity;
    @ManyToOne
    @JoinColumn(name = "assigned_item_id")
    private Item assignedItem;
    private Double loadQuantity;

    /** Train-specific: list of cart capacities */
    @ElementCollection
    @CollectionTable(name = "train_cart_capacities", joinColumns = @JoinColumn(name = "route_id"))
    private List<Double> cartCapacities = new ArrayList<>();

    /** Train-specific: per-cart allocations */
    @ElementCollection
    @CollectionTable(name = "cart_allocations", joinColumns = @JoinColumn(name = "route_id"))
    private List<CartAllocation> cartAllocations = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private TransportPlan transportPlan;
}
