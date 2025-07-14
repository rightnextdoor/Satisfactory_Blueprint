package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.*;
import com.satisfactory.blueprint.entity.TransportPlan;
import com.satisfactory.blueprint.service.TransportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing TransportPlan and TransportRoute operations.
 */
@RestController
@RequestMapping("/api/transport-plans")
@RequiredArgsConstructor
public class TransportPlanController {

    private final TransportService transportService;

    /**
     * List all transport plans for a given planner.
     */
    @GetMapping("/list")
    public List<TransportPlanDto> listAllPlans() {
        return transportService.listAllPlans();
    }

    /**
     * Get a single transport plan by ID.
     */
    @PostMapping("/get")
    public TransportPlanDto getPlan(@RequestBody IdRequest request) {
        return transportService.getPlan(request.getId());
    }

    /**
     * Create a new transport plan.
     */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public TransportPlanDto createPlan(@RequestBody CreateTransportPlanRequest request) {
        return transportService.createPlan(request);
    }

    /**
     * Update an existing transport plan.
     */
    @PutMapping("/update")
    public TransportPlanDto updatePlan(@RequestBody UpdateTransportPlanRequest request) {
        return transportService.updatePlan(request);
    }

    /**
     * Delete a transport plan.
     */
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlan(@RequestBody IdRequest request) {
        transportService.deletePlan(request);
    }

    /**
     * Create a new route under a transport plan.
     */
    @PostMapping("/routes/create")
    @ResponseStatus(HttpStatus.CREATED)
    public TransportPlanDto createRoute(@RequestBody CreateTransportRouteRequest request) {
        transportService.createRoute(request);
        return transportService.getPlan(request.getPlanId());
    }

    @PostMapping("/routes/list")
    public List<TransportRouteDto> listRoutes(@RequestBody IdRequest request) {
        return transportService.findRoutesByPlan(request.getId());
    }

    /**
     * Update an existing route.
     */
    @PutMapping("/routes/update")
    public TransportPlanDto updateRoute(@RequestBody UpdateTransportRouteRequest request) {
        transportService.updateRoute(request);
        return transportService.getPlan(request.getPlanId());
    }

    /**
     * Delete a route.
     */
    @DeleteMapping("/routes/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public TransportPlanDto  deleteRoute(@RequestBody IdRequest request) {
        TransportPlan plan = transportService.findPlanByRoute(request.getId());
        transportService.deleteRoute(request);
        return transportService.getPlan(plan.getId());
    }
}
