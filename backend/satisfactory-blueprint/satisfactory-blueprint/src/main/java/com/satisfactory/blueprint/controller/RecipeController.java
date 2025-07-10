package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.IdRequest;
import com.satisfactory.blueprint.dto.NameRequest;
import com.satisfactory.blueprint.dto.RecipeDto;
import com.satisfactory.blueprint.dto.ItemDataDto;
import com.satisfactory.blueprint.dto.ItemDto;
import com.satisfactory.blueprint.entity.Recipe;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    /** List all recipes */
    @GetMapping("/list")
    public List<RecipeDto> listAll() {
        return recipeService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Get a single recipe by ID */
    @PostMapping("/get")
    public RecipeDto getById(@RequestBody IdRequest req) {
        Recipe recipe = recipeService.findById(req.getId());
        return toDto(recipe);
    }

    /** Find all recipes that produce a given item */
    @PostMapping("/by-item")
    public List<RecipeDto> getByItem(@RequestBody NameRequest req) {
        return recipeService.findByItemName(req.getName()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Get the default (non-alternate) recipe for a given item */
    @PostMapping("/default")
    public RecipeDto getDefault(@RequestBody NameRequest req) {
        Recipe recipe = recipeService.getDefaultByItemName(req.getName());
        return toDto(recipe);
    }

    /** Create a new recipe */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public RecipeDto create(@RequestBody RecipeDto dto) {
        Recipe created = recipeService.create(dto);
        return toDto(created);
    }

    /** Update an existing recipe */
    @PutMapping("/update")
    public RecipeDto update(@RequestBody RecipeDto dto) {
        Recipe updated = recipeService.update(dto.getId(), dto);
        return toDto(updated);
    }

    /** Delete a recipe */
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestBody IdRequest req) {
        recipeService.delete(req.getId());
    }

    private RecipeDto toDto(Recipe recipe) {
        RecipeDto dto = new RecipeDto();
        dto.setId(recipe.getId());
        dto.setAlternate(recipe.isAlternate());
        dto.setSpaceElevator(recipe.isSpaceElevator());
        dto.setFuel(recipe.isFuel());
        dto.setWeaponOrTool(recipe.isWeaponOrTool());
        dto.setHasByProduct(recipe.isHasByProduct());
        dto.setTier(recipe.getTier());
        dto.setBuilding(recipe.getBuilding().getType());

        // itemToBuild
        ItemData out = recipe.getItemToBuild();
        ItemDataDto outDto = new ItemDataDto();
        outDto.setAmount(out.getAmount());
        ItemDto outItem = new ItemDto();
        outItem.setId(out.getItem().getId());
        outItem.setName(out.getItem().getName());
        outItem.setIconKey(out.getItem().getIconKey());
        outItem.setResource(out.getItem().isResource());
        outDto.setItem(outItem);
        dto.setItemToBuild(outDto);

        // items
        List<ItemDataDto> ingredients = recipe.getItems().stream().map(i -> {
            ItemDataDto idto = new ItemDataDto();
            idto.setAmount(i.getAmount());
            ItemDto it = new ItemDto();
            it.setId(i.getItem().getId());
            it.setName(i.getItem().getName());
            it.setIconKey(i.getItem().getIconKey());
            it.setResource(i.getItem().isResource());
            idto.setItem(it);
            return idto;
        }).collect(Collectors.toList());
        dto.setItems(ingredients);

        // byProduct
        if (recipe.isHasByProduct()) {
            ItemData bp = recipe.getByProduct();
            ItemDataDto bpDto = new ItemDataDto();
            bpDto.setAmount(bp.getAmount());
            ItemDto bpItem = new ItemDto();
            bpItem.setId(bp.getItem().getId());
            bpItem.setName(bp.getItem().getName());
            bpItem.setIconKey(bp.getItem().getIconKey());
            bpItem.setResource(bp.getItem().isResource());
            bpDto.setItem(bpItem);
            dto.setByProduct(bpDto);
        }

        return dto;
    }
}
