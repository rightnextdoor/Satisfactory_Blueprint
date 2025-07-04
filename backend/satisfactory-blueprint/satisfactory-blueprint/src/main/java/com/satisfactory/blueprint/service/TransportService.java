package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.entity.*;
import com.satisfactory.blueprint.entity.enums.FuelType;
import com.satisfactory.blueprint.entity.enums.VehicleType;
import com.satisfactory.blueprint.exception.BadRequestException;
import com.satisfactory.blueprint.exception.ResourceNotFoundException;
import com.satisfactory.blueprint.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TransportService {

    private final TransportPlanRepository planRepo;
    private final TransportRouteRepository routeRepo;
    private final TransportItemRepository itemRepo;
    private final PlannerRepository plannerRepo;
    private final ItemRepository itemRepository;

    public TransportService(
            TransportPlanRepository planRepo,
            TransportRouteRepository routeRepo,
            TransportItemRepository itemRepo,
            PlannerRepository plannerRepo,
            ItemRepository itemRepository
    ) {
        this.planRepo = planRepo;
        this.routeRepo = routeRepo;
        this.itemRepo = itemRepo;
        this.plannerRepo = plannerRepo;
        this.itemRepository = itemRepository;
    }

    /** List all transport plans for a given factory plan */
    public List<TransportPlan> findPlansByPlanner(Long plannerId) {
        if (!plannerRepo.existsById(plannerId)) {
            throw new ResourceNotFoundException("Planner not found: " + plannerId);
        }
        return planRepo.findBySourcePlanner_Id(plannerId);
    }

    /** Get a single transport plan by ID */
    public TransportPlan findPlanById(Long planId) {
        return planRepo.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("TransportPlan not found: " + planId));
    }

    /** Create a new transport plan tied to a factory plan */
    public TransportPlan createPlan(Long plannerId, String name) {
        Planner source = plannerRepo.findById(plannerId)
                .orElseThrow(() -> new ResourceNotFoundException("Planner not found: " + plannerId));
        TransportPlan plan = new TransportPlan();
        plan.setName(name);
        plan.setSourcePlanner(source);
        return planRepo.save(plan);
    }

    /** Update transport plan name */
    public TransportPlan updatePlan(Long planId, String name) {
        TransportPlan plan = findPlanById(planId);
        if (name == null || name.isBlank()) {
            throw new BadRequestException("TransportPlan name cannot be empty");
        }
        plan.setName(name);
        return planRepo.save(plan);
    }

    /** Delete a transport plan and its routes/items */
    public void deletePlan(Long planId) {
        TransportPlan plan = findPlanById(planId);
        planRepo.delete(plan);
    }

    /** Add a new route to a transport plan */
    public TransportRoute addRoute(Long planId,
                                   VehicleType vehicleType,
                                   FuelType fuelType,
                                   String destinationLabel,
                                   int vehicleCount,
                                   int carsPerVehicle) {
        TransportPlan plan = findPlanById(planId);
        TransportRoute route = new TransportRoute();
        route.setTransportPlan(plan);
        route.setVehicleType(vehicleType);
        route.setFuelType(fuelType);
        route.setDestinationLabel(destinationLabel);
        route.setVehicleCount(vehicleCount);
        route.setCarsPerVehicle(carsPerVehicle);
        return routeRepo.save(route);
    }

    /** Update an existing route */
    public TransportRoute updateRoute(Long routeId,
                                      VehicleType vehicleType,
                                      FuelType fuelType,
                                      String destinationLabel,
                                      Integer vehicleCount,
                                      Integer carsPerVehicle) {
        TransportRoute route = routeRepo.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("TransportRoute not found: " + routeId));
        if (vehicleType != null) route.setVehicleType(vehicleType);
        if (fuelType != null) route.setFuelType(fuelType);
        if (destinationLabel != null && !destinationLabel.isBlank()) {
            route.setDestinationLabel(destinationLabel);
        }
        if (vehicleCount != null) route.setVehicleCount(vehicleCount);
        if (carsPerVehicle != null) route.setCarsPerVehicle(carsPerVehicle);
        return routeRepo.save(route);
    }

    /** Delete a route (and its items) */
    public void deleteRoute(Long routeId) {
        TransportRoute route = routeRepo.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("TransportRoute not found: " + routeId));
        routeRepo.delete(route);
    }

    /** Add an item amount to a route */
    public TransportItem addTransportItem(Long routeId, Long itemId, double amountPerMinute, Integer carSlot) {
        TransportRoute route = routeRepo.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("TransportRoute not found: " + routeId));
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemId));
        TransportItem ti = new TransportItem();
        ti.setRoute(route);
        ti.setItem(item);
        ti.setAmountPerMinute(amountPerMinute);
        ti.setCarSlot(carSlot);
        return itemRepo.save(ti);
    }

    /** Update an existing transport item */
    public TransportItem updateTransportItem(Long transportItemId,
                                             Double amountPerMinute,
                                             Integer carSlot) {
        TransportItem ti = itemRepo.findById(transportItemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "TransportItem not found: " + transportItemId));
        if (amountPerMinute != null) ti.setAmountPerMinute(amountPerMinute);
        if (carSlot != null) ti.setCarSlot(carSlot);
        return itemRepo.save(ti);
    }

    /** Delete a transport item */
    public void deleteTransportItem(Long transportItemId) {
        TransportItem ti = itemRepo.findById(transportItemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "TransportItem not found: " + transportItemId));
        itemRepo.delete(ti);
    }
}
