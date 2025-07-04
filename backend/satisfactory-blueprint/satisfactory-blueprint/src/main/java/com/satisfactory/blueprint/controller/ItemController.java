package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.IdRequest;
import com.satisfactory.blueprint.dto.ItemDto;
import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.service.ItemService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    /** List all items */
    @GetMapping("/list")
    public List<Item> listAll() {
        return itemService.findAll();
    }

    /** Get a single item by ID (in request body) */
    @PostMapping("/get")
    public Item getById(@RequestBody IdRequest req) {
        return itemService.findById(req.getId());
    }

    /** Create a new item */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Item create(@RequestBody ItemDto dto) {
        return itemService.create(dto);
    }

    /** Update an existing item */
    @PutMapping("/update")
    public Item update(@RequestBody ItemDto dto) {
        return itemService.update(dto);
    }

    /** Delete an item */
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestBody IdRequest req) {
        itemService.delete(req.getId());
    }
}
