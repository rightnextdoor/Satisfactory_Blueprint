package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.IdRequest;
import com.satisfactory.blueprint.dto.NameRequest;
import com.satisfactory.blueprint.dto.RecipeDto;
import com.satisfactory.blueprint.entity.Recipe;
import com.satisfactory.blueprint.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    /** List all recipes */
    @GetMapping("/list")
    public List<Recipe> listAll() {
        return recipeService.findAll();
    }

    /** Get a single recipe by ID */
    @PostMapping("/get")
    public Recipe getById(@RequestBody IdRequest req) {
        return recipeService.findById(req.getId());
    }

    /** Find all recipes that produce a given item */
    @PostMapping("/by-item")
    public List<Recipe> getByItem(@RequestBody NameRequest req) {
        return recipeService.findByItemName(req.getName());
    }

    /** Get the default (non-alternate) recipe for a given item */
    @PostMapping("/default")
    public Recipe getDefault(@RequestBody NameRequest req) {
        return recipeService.getDefaultByItemName(req.getName());
    }

    /** Create a new recipe */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Recipe create(@RequestBody RecipeDto dto) {
        return recipeService.create(dto);
    }

    /** Update an existing recipe */
    @PutMapping("/update")
    public Recipe update(@RequestBody RecipeDto dto) {
        return recipeService.update(dto.getId(), dto);
    }

    /** Delete a recipe */
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestBody IdRequest req) {
        recipeService.delete(req.getId());
    }
}
