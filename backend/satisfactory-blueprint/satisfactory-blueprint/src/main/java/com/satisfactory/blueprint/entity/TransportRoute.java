package com.satisfactory.blueprint.entity;

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

    /** The transport plan this route belongs to */
    @ManyToOne(optional = false)
    @JoinColumn(name = "transport_plan_id", nullable = false)
    private TransportPlan transportPlan;

    /** Type of vehicle used (TRAIN, TRUCK, PLANE) */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType vehicleType;

    /** Fuel type required by this vehicle (e.g., DIESEL, TURBOFUEL, BATTERY) */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FuelType fuelType;

    /** Label or destination for this route (e.g., "Home Base", "Mine Outpost") */
    @Column(nullable = false)
    private String destinationLabel;

    /** How many vehicles of this type are assigned */
    @Column(nullable = false)
    private int vehicleCount;

    /** Number of cars (or trailers) per vehicle */
    @Column(nullable = false)
    private int carsPerVehicle;

    /** Items assigned to this route */
    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransportItem> items = new ArrayList<>();
}
