package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.BuildingDto;
import com.satisfactory.blueprint.dto.IdRequest;
import com.satisfactory.blueprint.entity.Building;
import com.satisfactory.blueprint.service.BuildingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
public class BuildingController {

    private final BuildingService buildingService;

    public BuildingController(BuildingService buildingService) {
        this.buildingService = buildingService;
    }

    /** List all buildings */
    @GetMapping("/list")
    public List<Building> listAll() {
        return buildingService.findAll();
    }

    /** Get a single building by ID */
    @PostMapping("/get")
    public Building getById(@RequestBody IdRequest req) {
        return buildingService.findById(req.getId());
    }

    /** Create a new building */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Building create(@RequestBody BuildingDto dto) {
        return buildingService.create(dto);
    }

    /** Update an existing building */
    @PutMapping("/update")
    public Building update(@RequestBody BuildingDto dto) {
        return buildingService.update(dto);
    }

    /** Delete a building */
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestBody IdRequest req) {
        buildingService.delete(req.getId());
    }
}
