package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.IdRequest;
import com.satisfactory.blueprint.dto.ItemDto;
import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.service.ItemService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    /** List all items */
    @GetMapping("/list")
    public List<ItemDto> listAll() {
        return itemService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Get a single item by ID (in request body) */
    @PostMapping("/get")
    public ItemDto getById(@RequestBody IdRequest req) {
        Item item = itemService.findById(req.getId());
        return toDto(item);
    }

    /** Create a new item */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ItemDto create(@RequestBody ItemDto dto) {
        Item created = itemService.create(dto);
        return toDto(created);
    }

    /** Update an existing item */
    @PutMapping("/update")
    public ItemDto update(@RequestBody ItemDto dto) {
        Item updated = itemService.update(dto);
        return toDto(updated);
    }

    /** Delete an item */
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestBody IdRequest req) {
        itemService.delete(req.getId());
    }

    // ——————————————————————————————————————————————————
    // DTO ↔ Entity mapping
    // ——————————————————————————————————————————————————

    private ItemDto toDto(Item item) {
        ItemDto dto = new ItemDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setIconKey(item.getIconKey());
        dto.setResource(item.isResource());
        return dto;
    }
}
