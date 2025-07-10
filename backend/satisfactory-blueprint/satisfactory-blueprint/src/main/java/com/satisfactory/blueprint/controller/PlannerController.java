package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.*;
import com.satisfactory.blueprint.entity.Planner;
import com.satisfactory.blueprint.service.PlannerService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planners")
public class PlannerController {

    private final PlannerService plannerService;

    public PlannerController(PlannerService plannerService) {
        this.plannerService = plannerService;
    }

    /** List all planners (no body needed) */
    @GetMapping("/list")
    public List<Planner> listAll() {
        return plannerService.findAll();
    }

    /** Get a single planner by ID in the request body */
    @PostMapping("/get")
    public Planner getById(@RequestBody IdRequest req) {
        return plannerService.findById(req.getId());
    }

    /** Create a new planner */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Planner create(@RequestBody PlannerDto dto) {
        return plannerService.create(dto);
    }

    /** Update planner settings (name, generator, targetAmount, etc.) */
    @PutMapping("/settings")
    public Planner updateSettings(@RequestBody PlannerDto dto) {
        return plannerService.updatePlannerSettings(dto);
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
    public Planner updateEntryRecipe(@RequestBody EntryRecipeRequest req) {
        return plannerService.updatePlannerEntryRecipe(
                req.getPlannerId(), req.getEntryDto()
        );
    }

    /** Add or update a manual allocation on an entry */
    @PutMapping("/entry/manual")
    public Planner updateEntryManual(@RequestBody ManualAllocationRequest req) {
        return plannerService.updatePlannerEntryManualAllocation(
                req.getPlannerId(),
                req.getEntryId(),
                req.getManualAllocationDto()
        );
    }

    /** Remove a manual allocation from an entry */
    @DeleteMapping("/entry/manual/delete")
    public Planner deleteEntryManual(@RequestBody ManualAllocationDeleteRequest req) {
        return plannerService.deletePlannerEntryManualAllocation(
                req.getPlannerId(),
                req.getEntryId(),
                req.getLabel()
        );
    }

    /** Delete an entire entry (recipe) from a planner */
    @DeleteMapping("/entry/delete")
    public Planner deleteEntry(@RequestBody EntryDeleteRequest req) {
        return plannerService.deletePlannerEntry(
                req.getPlannerId(),
                req.getEntryId()
        );
    }
}

