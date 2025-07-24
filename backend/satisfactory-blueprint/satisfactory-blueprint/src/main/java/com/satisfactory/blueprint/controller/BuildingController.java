package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.BuildingDto;
import com.satisfactory.blueprint.dto.IdRequest;
import com.satisfactory.blueprint.dto.ImageDto;
import com.satisfactory.blueprint.entity.Building;
import com.satisfactory.blueprint.entity.Image;
import com.satisfactory.blueprint.service.BuildingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buildings")
public class BuildingController {

    private final BuildingService buildingService;

    public BuildingController(BuildingService buildingService) {
        this.buildingService = buildingService;
    }

    /** List all buildings */
    @GetMapping("/list")
    public List<BuildingDto> listAll() {
        return buildingService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Get a single building by ID */
    @PostMapping("/get")
    public BuildingDto getById(@RequestBody IdRequest req) {
        Building b = buildingService.findById(req.getId());
        return toDto(b);
    }

    /** Create a new building */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public BuildingDto create(@RequestBody BuildingDto dto) {
        Building created = buildingService.create(dto);
        return toDto(created);
    }

    /** Update an existing building */
    @PutMapping("/update")
    public BuildingDto update(@RequestBody BuildingDto dto) {
        Building updated = buildingService.update(dto);
        return toDto(updated);
    }

    /** Delete a building */
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestBody IdRequest req) {
        buildingService.delete(req.getId());
    }

    // ----- MAPPING -----

    private BuildingDto toDto(Building b) {
        BuildingDto dto = new BuildingDto();
        dto.setId(b.getId());
        dto.setType(b.getType());
        dto.setPowerUsage(b.getPowerUsage());
        dto.setSortOrder(b.getSortOrder());

        // map the Image entity to ImageDto
        Image imgEnt = b.getImage();
        if (imgEnt != null) {
            ImageDto imgDto = new ImageDto();
            imgDto.setId(imgEnt.getId());
            imgDto.setContentType(imgEnt.getContentType());
            imgDto.setData(imgEnt.getData());
            dto.setImage(imgDto);
        }

        return dto;
    }

}
