package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.dto.*;
import com.satisfactory.blueprint.entity.*;
import com.satisfactory.blueprint.entity.embedded.CartAllocation;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.entity.embedded.TransportItem;
import com.satisfactory.blueprint.repository.ItemRepository;
import com.satisfactory.blueprint.repository.TransportPlanRepository;
import com.satisfactory.blueprint.repository.TransportRouteRepository;
import com.satisfactory.blueprint.entity.enums.VehicleType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for managing transport plans and routes, including coverage calculations and CRUD operations.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class TransportService {

    private final TransportPlanRepository planRepo;
    private final TransportRouteRepository routeRepo;
    private final PlannerService plannerService;
    private final ItemRepository itemRepo;

    public List<TransportPlanDto> findPlansByPlanner(Long plannerId) {
        return planRepo
                .findByPlannerId(plannerId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    public List<TransportPlanDto> listAllPlans() {
        return planRepo.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<TransportRouteDto> findRoutesByPlan(Long planId) {
        return routeRepo
                .findByTransportPlanId(planId)
                .stream()
                .map(this::toRouteDto)
                .collect(Collectors.toList());
    }
    /**
     * Create a new TransportPlan, optionally importing all resources from an existing Planner.
     */
    public TransportPlanDto createPlan(CreateTransportPlanRequest request) {
        TransportPlan plan = new TransportPlan();
        plan.setName(request.getName());

        Long plannerId = request.getPlannerId();
        if (plannerId != null) {
            // Verify planner exists
            plannerService.findById(plannerId);
            plan.setPlannerId(plannerId);
        }

        if (Boolean.TRUE.equals(request.isAddAllResources()) && plan.getPlannerId() != null) {
            // Import all resources: flatten ItemData → TransportItem(item, targetQuantity, coveredQuantity)
            List<TransportItem> items = plannerService
                    .getResourcesForPlanner(plannerId).stream()
                    .map(data -> new TransportItem(
                            data.getItem(),
                            data.getAmount(),
                            0.0
                    ))
                    .collect(Collectors.toList());
            plan.setTransportItems(items);
        } else {
            // Manual targets: lookup Item and set as targetQuantity
            List<TransportItem> items = request.getTransportItems().stream()
                    .map(dto -> {
                        Item item = itemRepo.findById(dto.getItemId())
                                .orElseThrow(() -> new NoSuchElementException(
                                        "Item not found: " + dto.getItemId()));
                        return new TransportItem(
                                item,
                                dto.getTargetQuantity(),
                                0.0
                        );
                    })
                    .collect(Collectors.toList());
            plan.setTransportItems(items);
        }

        plan = planRepo.save(plan);
        return toDto(plan);
    }

    /**
     * Update an existing TransportPlan's name or items list.
     */
    public TransportPlanDto updatePlan(UpdateTransportPlanRequest request) {
        TransportPlan plan = planRepo.findById(request.getId())
                .orElseThrow(() -> new NoSuchElementException("Plan not found: " + request.getId()));

        // Update name
        plan.setName(request.getName());

        // Handle planner reassignment if provided
        Long newPlannerId = request.getPlannerId();
        if (newPlannerId != null && !newPlannerId.equals(plan.getPlannerId())) {
            // Verify planner exists
            plannerService.findById(newPlannerId);
            plan.setPlannerId(newPlannerId);
        }

        // Rebuild transport items based on addAllResources flag
        if (Boolean.TRUE.equals(request.isAddAllResources()) && plan.getPlannerId() != null) {
            List<TransportItem> items = plannerService
                    .getResourcesForPlanner(plan.getPlannerId()).stream()
                    .map(data -> new TransportItem(
                            data.getItem(),
                            data.getAmount(),
                            0.0
                    ))
                    .collect(Collectors.toList());
            plan.setTransportItems(items);
        } else {
            plan.setTransportItems(mapToTransportItems(request.getTransportItems()));
        }

        // Recompute coverage
        recalcCoverage(plan);

        plan = planRepo.save(plan);
        return toDto(plan);
    }


    /**
     * Delete a TransportPlan by id.
     */
    public void deletePlan(IdRequest request) {
        if (!planRepo.existsById(request.getId())) {
            throw new NoSuchElementException("Plan not found: " + request.getId());
        }
        planRepo.deleteById(request.getId());
    }

    /**
     * Fetch a TransportPlan by id.
     */
    @Transactional(readOnly = true)
    public TransportPlanDto getPlan(Long id) {
        TransportPlan plan = planRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Plan not found: " + id));
        return toDto(plan);
    }

    /**
     * Create a new route under a given plan.
     */
    public TransportRouteDto createRoute(CreateTransportRouteRequest req) {
        TransportPlan plan = planRepo.findById(req.getPlanId())
                .orElseThrow(() -> new NoSuchElementException("Plan not found: " + req.getPlanId()));

        TransportRoute route = new TransportRoute();
        applyRouteData(route,
                req.getVehicleType(),
                req.getCapacity(),
                req.getAssignedItemId(),
                req.getCartCapacities(),
                null
        );
        route.setStationName(req.getStationName());
        route.setTransportPlan(plan);
        route = routeRepo.save(route);
        recalcCoverage(plan);
        planRepo.save(plan);
        return toRouteDto(route);
    }

    /**
     * Update an existing route.
     */
    public TransportRouteDto updateRoute(UpdateTransportRouteRequest req) {
        TransportRoute route = routeRepo.findById(req.getId())
                .orElseThrow(() -> new NoSuchElementException("Route not found: " + req.getId()));

        // Update station name
        route.setStationName(req.getStationName());

        // Don’t override vehicleType—keep the existing one on the route
        VehicleType type = route.getVehicleType();

        // Apply the rest of the data based on that same type
        applyRouteData(
                route,
                type,
                req.getCapacity(),
                req.getAssignedItemId(),
                req.getCartCapacities(),
                req.getCartAllocations()
        );

        // Persist and recalculate as before
        route = routeRepo.save(route);
        recalcCoverage(route.getTransportPlan());
        planRepo.save(route.getTransportPlan());

        return toRouteDto(route);
    }

    /**
     * Delete a route, refunding its coverage back to the plan.
     */
    public void deleteRoute(IdRequest req) {
        // 1) Load the route (and its owning plan) in the same persistence context
        TransportRoute route = routeRepo.findById(req.getId())
                .orElseThrow(() -> new NoSuchElementException("Route not found: " + req.getId()));
        TransportPlan plan = route.getTransportPlan();

        // 2) Remove the route from the plan’s collection (orphanRemoval=true will delete it)
        plan.getRoutes().remove(route);

        // 3) Recompute coverage now that the route is gone
        recalcCoverage(plan);

        // 4) Save the plan; Hibernate will cascade‐delete that orphaned route
        planRepo.save(plan);
    }

    public TransportPlan findPlanByRoute(Long routeId) {
        TransportRoute route = routeRepo.findById(routeId)
                .orElseThrow(() -> new NoSuchElementException("Route not found: " + routeId));
        return route.getTransportPlan();
    }

    //--------------- Helper Methods ---------------

    private List<TransportItem> mapToTransportItems(List<TransportItemRequestDto> dtos) {
        return dtos.stream()
                .map(dto -> {
                    Item item = itemRepo.findById(dto.getItemId())
                            .orElseThrow(() -> new NoSuchElementException(
                                    "Item not found: " + dto.getItemId()));
                    // Build TransportItem directly, no more ItemData embeddable
                    return new TransportItem(
                            item,
                            dto.getTargetQuantity(),
                            0.0  // initial coveredQuantity
                    );
                })
                .collect(Collectors.toList());
    }


    private void applyRouteData(
            TransportRoute route,
            VehicleType type,
            Double capacity,
            Long assignedItemId,
            List<Double> cartCaps,
            List<CartAllocationDto> cartDtos
    ) {
        // Vehicle type remains whatever was originally set on the route
        route.setVehicleType(type);

        if (type == VehicleType.TRAIN) {
            // Clear truck/plane fields
            route.setCapacity(null);
            route.setAssignedItem(null);
            route.setLoadQuantity(null);

            // Replace cart capacities
            route.getCartCapacities().clear();
            if (cartCaps != null) {
                route.setCartCapacities(new ArrayList<>(cartCaps));
            }

            // Replace cart allocations
            route.getCartAllocations().clear();
            if (cartDtos != null) {
                List<CartAllocation> allocs = cartDtos.stream()
                        .map(dto -> {
                            Item cartItem = itemRepo.findById(dto.getItemId())
                                    .orElseThrow(() -> new NoSuchElementException(
                                            "Item not found: " + dto.getItemId()));
                            return new CartAllocation(
                                    dto.getCartIndex(),
                                    cartItem,
                                    dto.getCartCapacity(),
                                    dto.getCartCapacity()  // loadedQuantity == capacity
                            );
                        })
                        .collect(Collectors.toList());
                route.getCartAllocations().addAll(allocs);
            }

        } else {
            // Truck or Plane: single-item load, loadQuantity == capacity
            route.getCartCapacities().clear();
            route.getCartAllocations().clear();

            route.setCapacity(capacity);
            Item item = itemRepo.findById(assignedItemId)
                    .orElseThrow(() -> new NoSuchElementException(
                            "Item not found: " + assignedItemId));
            route.setAssignedItem(item);

            // Use capacity as the actual load
            route.setLoadQuantity(capacity);
        }
    }

    private void recalcCoverage(TransportPlan plan) {
        // Reset covered quantities
        plan.getTransportItems().forEach(ti -> ti.setCoveredQuantity(0.0));

        // Sum loads from each route
        for (TransportRoute route : plan.getRoutes()) {
            if (route.getVehicleType() == VehicleType.TRAIN) {
                for (CartAllocation cart : route.getCartAllocations()) {
                    TransportItem ti = findItem(plan, cart.getItem().getId());
                    ti.setCoveredQuantity(ti.getCoveredQuantity() + cart.getLoadedQuantity());
                }
            } else {
                TransportItem ti = findItem(plan, route.getAssignedItem().getId());
                ti.setCoveredQuantity(ti.getCoveredQuantity() + route.getCapacity());
            }
        }

        // Clamp coveredQuantity at targetQuantity
        plan.getTransportItems().forEach(ti -> {
            double target = ti.getTargetQuantity();
            if (ti.getCoveredQuantity() > target) {
                ti.setCoveredQuantity(target);
            }
        });
    }


    private TransportItem findItem(TransportPlan plan, Long itemId) {
        return plan.getTransportItems().stream()
                .filter(ti -> ti.getItem().getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException(
                        "Item not found in plan: " + itemId));
    }


    /**
     * Convert entity to DTO. Methods toRouteDto and toDto omitted for brevity.
     */
    private TransportPlanDto toDto(TransportPlan plan) {
        TransportPlanDto dto = new TransportPlanDto();
        dto.setId(plan.getId());
        dto.setName(plan.getName());
        dto.setPlannerId(plan.getPlannerId());

        // Map each TransportItem (with remaining calculation)
        List<TransportItemDto> itemDtos = plan.getTransportItems().stream()
                .map(ti -> {
                    // Now ti.getItem() returns the Item entity directly
                    Item itemEnt = ti.getItem();
                    ItemDto itemDto = new ItemDto(
                            itemEnt.getId(),
                            itemEnt.getName(),
                            itemEnt.getIconKey(),
                            itemEnt.isResource()
                    );
                    double target   = ti.getTargetQuantity();
                    double covered  = ti.getCoveredQuantity();
                    double remaining = Math.max(target - covered, 0);
                    return new TransportItemDto(itemDto, target, covered, remaining);
                })
                .collect(Collectors.toList());
        dto.setTransportItems(itemDtos);

        // Map each Route
        List<TransportRouteDto> routeDtos = plan.getRoutes().stream()
                .map(this::toRouteDto)
                .collect(Collectors.toList());
        dto.setRoutes(routeDtos);

        return dto;
    }


    /**
     * Convert a TransportRoute entity into its DTO.
     */
    private TransportRouteDto toRouteDto(TransportRoute route) {
        TransportRouteDto dto = new TransportRouteDto();
        dto.setId(route.getId());
        dto.setPlanId(route.getTransportPlan().getId());
        dto.setStationName(route.getStationName());
        dto.setVehicleType(route.getVehicleType());
        dto.setCapacity(route.getCapacity());
        dto.setLoadQuantity(route.getLoadQuantity());

        if (route.getAssignedItem() != null) {
            Item item = route.getAssignedItem();
            dto.setAssignedItem(new ItemDto(
                    item.getId(),
                    item.getName(),
                    item.getIconKey(),
                    item.isResource()
            ));
        }

        dto.setCartCapacities(new ArrayList<>(route.getCartCapacities()));
        List<CartAllocationDto> cartDtos = route.getCartAllocations().stream()
                .map(ca -> new CartAllocationDto(
                        ca.getCartIndex(),
                        ca.getItem().getId(),
                        ca.getCartCapacity(),
                        ca.getLoadedQuantity()
                ))
                .collect(Collectors.toList());
        dto.setCartAllocations(cartDtos);

        return dto;
    }
}
