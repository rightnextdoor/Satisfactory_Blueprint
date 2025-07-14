package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.*;
import com.satisfactory.blueprint.service.PlannerService;
import com.satisfactory.blueprint.mapper.PlannerMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planners")
public class PlannerController {

    private final PlannerService plannerService;
    private final PlannerMapper  plannerMapper;

    public PlannerController(PlannerService plannerService,
                             PlannerMapper plannerMapper) {
        this.plannerService = plannerService;
        this.plannerMapper  = plannerMapper;
    }

    /** List all planners (no body needed) */
    @GetMapping("/list")
    public List<PlannerDto> listAll() {
        return plannerService.findAll().stream()
                .map(plannerMapper::toDto)
                .toList();
    }

    /** Get a single planner by ID in the request body */
    @PostMapping("/get")
    public PlannerDto getById(@RequestBody IdRequest req) {
        return plannerMapper.toDto(
                plannerService.findById(req.getId())
        );
    }

    /** Create a new planner */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public PlannerDto create(@RequestBody PlannerDto dto) {
        return plannerMapper.toDto(
                plannerService.create(dto)
        );
    }

    /** Update planner settings (name, generator, targetAmount, etc.) */
    @PutMapping("/settings")
    public PlannerDto updateSettings(@RequestBody PlannerDto dto) {
        return plannerMapper.toDto(
                plannerService.updatePlannerSettings(dto)
        );
    }

    /** Delete a planner by ID in the request body */
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlanner(@RequestBody IdRequest req) {
        plannerService.deletePlanner(req.getId());
    }

    //––– Entry‐level operations (all via body only) –––

    /** Swap an entry’s recipe */
    @PutMapping("/entry/recipe")
    public PlannerDto updateEntryRecipe(@RequestBody EntryRecipeRequest req) {
        return plannerMapper.toDto(
                plannerService.updatePlannerEntryRecipe(
                        req.getPlannerId(),
                        req.getEntryDto()
                )
        );
    }

    /** Add or update a manual allocation on an entry */
    @PutMapping("/entry/manual")
    public PlannerDto updateEntryManual(@RequestBody ManualAllocationRequest req) {
        return plannerMapper.toDto(
                plannerService.updatePlannerEntryManualAllocation(
                        req.getPlannerId(),
                        req.getEntryId(),
                        req.getManualAllocationDto()
                )
        );
    }

    /** Remove a manual allocation from an entry */
    @DeleteMapping("/entry/manual/delete")
    public PlannerDto deleteEntryManual(@RequestBody ManualAllocationDeleteRequest req) {
        return plannerMapper.toDto(
                plannerService.deletePlannerEntryManualAllocation(
                        req.getPlannerId(),
                        req.getEntryId(),
                        req.getLabel()
                )
        );
    }

    /** Delete an entire entry (recipe) from a planner */
    @DeleteMapping("/entry/delete")
    public PlannerDto deleteEntry(@RequestBody EntryDeleteRequest req) {
        return plannerMapper.toDto(
                plannerService.deletePlannerEntry(
                        req.getPlannerId(),
                        req.getEntryId()
                )
        );
    }
}
