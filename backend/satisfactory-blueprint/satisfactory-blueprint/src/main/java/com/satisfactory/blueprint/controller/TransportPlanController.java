package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.IdRequest;
import com.satisfactory.blueprint.dto.TransportPlanDto;
import com.satisfactory.blueprint.dto.TransportRouteDto;
import com.satisfactory.blueprint.dto.TransportItemDto;
import com.satisfactory.blueprint.entity.TransportPlan;
import com.satisfactory.blueprint.entity.TransportRoute;
import com.satisfactory.blueprint.entity.TransportItem;
import com.satisfactory.blueprint.service.TransportService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transport-plans")
public class TransportPlanController {

    private final TransportService transportService;

    public TransportPlanController(TransportService transportService) {
        this.transportService = transportService;
    }

    /** List all transport plans for a given factory planner */
    @PostMapping("/list")
    public List<TransportPlan> listByPlanner(@RequestBody IdRequest req) {
        return transportService.findPlansByPlanner(req.getId());
    }

    /** Get a single transport plan by ID */
    @PostMapping("/get")
    public TransportPlan getById(@RequestBody IdRequest req) {
        return transportService.findPlanById(req.getId());
    }

    /** Create a new transport plan */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public TransportPlan create(@RequestBody TransportPlanDto dto) {
        return transportService.createPlan(dto.getSourcePlannerId(), dto.getName());
    }

    /** Update an existing transport plan’s name */
    @PutMapping("/update")
    public TransportPlan update(@RequestBody TransportPlanDto dto) {
        return transportService.updatePlan(dto.getId(), dto.getName());
    }

    /** Delete a transport plan */
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestBody IdRequest req) {
        transportService.deletePlan(req.getId());
    }

    /** Add a new route to a transport plan */
    @PostMapping("/routes/create")
    @ResponseStatus(HttpStatus.CREATED)
    public TransportRoute addRoute(@RequestBody TransportRouteDto dto) {
        return transportService.addRoute(
                dto.getId(),
                dto.getVehicleType(),
                dto.getFuelType(),
                dto.getDestinationLabel(),
                dto.getVehicleCount(),
                dto.getCarsPerVehicle()
        );
    }

    /** Update an existing route */
    @PutMapping("/routes/update")
    public TransportRoute updateRoute(@RequestBody TransportRouteDto dto) {
        return transportService.updateRoute(
                dto.getId(),
                dto.getVehicleType(),
                dto.getFuelType(),
                dto.getDestinationLabel(),
                dto.getVehicleCount(),
                dto.getCarsPerVehicle()
        );
    }

    /** Delete a route */
    @DeleteMapping("/routes/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRoute(@RequestBody IdRequest req) {
        transportService.deleteRoute(req.getId());
    }

    /** Add an item to a route */
    @PostMapping("/routes/items/create")
    @ResponseStatus(HttpStatus.CREATED)
    public TransportItem addItem(@RequestBody TransportItemDto dto) {
        return transportService.addTransportItem(
                dto.getRouteId(),
                dto.getItemId(),
                dto.getAmountPerMinute(),
                dto.getCarSlot()
        );
    }

    /** Update an existing transport item */
    @PutMapping("/routes/items/update")
    public TransportItem updateItem(@RequestBody TransportItemDto dto) {
        return transportService.updateTransportItem(
                dto.getId(),
                dto.getAmountPerMinute(),
                dto.getCarSlot()
        );
    }

    /** Delete a transport item */
    @DeleteMapping("/routes/items/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@RequestBody TransportItemDto dto) {
        transportService.deleteTransportItem(dto.getId());
    }
}
