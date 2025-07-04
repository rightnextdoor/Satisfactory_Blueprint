package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.IdRequest;
import com.satisfactory.blueprint.dto.GeneratorDto;
import com.satisfactory.blueprint.entity.Generator;
import com.satisfactory.blueprint.service.GeneratorService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/generators")
public class GeneratorController {

    private final GeneratorService generatorService;

    public GeneratorController(GeneratorService generatorService) {
        this.generatorService = generatorService;
    }

    /** List all generators */
    @GetMapping("/list")
    public List<Generator> listAll() {
        return generatorService.findAll();
    }

    /** Get a single generator by ID */
    @PostMapping("/get")
    public Generator getById(@RequestBody IdRequest req) {
        return generatorService.findById(req.getId());
    }

    /** Create a new generator */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Generator create(@RequestBody GeneratorDto dto) {
        return generatorService.create(dto);
    }

    /** Update an existing generator */
    @PutMapping("/update")
    public Generator update(@RequestBody GeneratorDto dto) {
        return generatorService.update(dto.getId(), dto);
    }

    /** Delete a generator */
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestBody IdRequest req) {
        generatorService.delete(req.getId());
    }
}
