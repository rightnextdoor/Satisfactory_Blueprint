package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.IdRequest;
import com.satisfactory.blueprint.dto.PlannerDto;
import com.satisfactory.blueprint.dto.AddEntryRequest;
import com.satisfactory.blueprint.dto.UpdateEntryRequest;
import com.satisfactory.blueprint.entity.Planner;
import com.satisfactory.blueprint.entity.PlannerEntry;
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

    /** List all planners */
    @GetMapping("/list")
    public List<Planner> listAll() {
        return plannerService.findAll();
    }

    /** Get a single planner by ID */
    @PostMapping("/get")
    public Planner getById(@RequestBody IdRequest req) {
        return plannerService.findById(req.getId());
    }

    /** Create a new planner */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Planner create(@RequestBody PlannerDto dto) {
        return plannerService.create(dto.getName(), dto.isFuelFactory());
    }

    /** Update an existing planner’s name or fuel‐factory flag */
    @PutMapping("/update")
    public Planner update(@RequestBody PlannerDto dto) {
        return plannerService.update(dto.getId(), dto.getName(), dto.isFuelFactory());
    }

    /** Delete a planner */
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestBody IdRequest req) {
        plannerService.delete(req.getId());
    }

    /** Add a new entry to a planner */
    @PostMapping("/entries/create")
    @ResponseStatus(HttpStatus.CREATED)
    public PlannerEntry addEntry(@RequestBody AddEntryRequest req) {
        return plannerService.addEntry(
                req.getPlannerId(),
                req.getRecipeId(),
                req.getBuildingCount()
        );
    }

    /** Update an existing planner entry */
    @PutMapping("/entries/update")
    public PlannerEntry updateEntry(@RequestBody UpdateEntryRequest req) {
        return plannerService.updateEntry(
                req.getEntryId(),
                req.getBuildingCount(),
                req.getOutgoingAmountPerMinute(),
                req.getNewRecipeId()
        );
    }

    /** Delete a planner entry */
    @DeleteMapping("/entries/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEntry(@RequestBody IdRequest req) {
        plannerService.deleteEntry(req.getId());
    }
}
