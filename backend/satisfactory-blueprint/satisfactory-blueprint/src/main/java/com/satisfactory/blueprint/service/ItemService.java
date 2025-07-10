package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.dto.ItemDto;
import com.satisfactory.blueprint.entity.Generator;
import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.entity.Recipe;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.exception.BadRequestException;
import com.satisfactory.blueprint.exception.ResourceNotFoundException;
import com.satisfactory.blueprint.repository.GeneratorRepository;
import com.satisfactory.blueprint.repository.ItemRepository;
import com.satisfactory.blueprint.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ItemService {

    private final ItemRepository itemRepository;
    private final RecipeRepository recipeRepo;
    private final GeneratorRepository generatorRepo;

    public ItemService(ItemRepository itemRepository,
                       RecipeRepository recipeRepo,
                       GeneratorRepository generatorRepo) {
        this.itemRepository = itemRepository;
        this.recipeRepo    = recipeRepo;
        this.generatorRepo = generatorRepo;
    }

    /**
     * Retrieve all items.
     */
    public List<Item> findAll() {
        return itemRepository.findAll();
    }

    /**
     * Retrieve a single item by ID, or throw 404 if not found.
     */
    public Item findById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Item not found with id: " + id));
    }

    /**
     * Create a new item from DTO.
     */
    public Item create(ItemDto dto) {
        if (itemRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new BadRequestException(
                    "An item with name '" + dto.getName() + "' already exists.");
        }
        Item item = new Item();
        item.setName(dto.getName());
        item.setIconKey(dto.getIconKey());
        item.setResource(dto.isResource());
        return itemRepository.save(item);
    }

    /**
     * Update an existing item by DTO (which includes the ID).
     */
    public Item update(ItemDto dto) {
        Item existing = findById(dto.getId());

        String newName = dto.getName();
        if (!existing.getName().equalsIgnoreCase(newName)
                && itemRepository.existsByNameIgnoreCase(newName)) {
            throw new BadRequestException(
                    "An item with name '" + newName + "' already exists.");
        }
        existing.setName(newName);
        existing.setIconKey(dto.getIconKey());
        existing.setResource(dto.isResource());
        return itemRepository.save(existing);
    }

    /**
     * Delete an item by ID. Throws 404 if not found.
     */
    public void delete(Long id) {
        // 1) load or 404
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + id));

        // 2) delete any recipes *producing* this item
        List<Recipe> producing = recipeRepo.findAll().stream()
                .filter(r -> r.getItemToBuild().getItem().getId().equals(id))
                .toList();
        if (!producing.isEmpty()) {
            recipeRepo.deleteAll(producing);
        }

        // 3) for remaining recipes, remove as-by-product and from ingredients
        recipeRepo.findAll().forEach(r -> {
            boolean dirty = false;
            // by-product
            if (r.isHasByProduct() &&
                    r.getByProduct().getItem().getId().equals(id)) {
                r.setByProduct(null);
                r.setHasByProduct(false);
                dirty = true;
            }
            // ingredients list
            if (r.getItems().removeIf(d -> d.getItem().getId().equals(id))) {
                dirty = true;
            }
            if (dirty) {
                recipeRepo.save(r);
            }
        });

        // 4) likewise clear out any generators pointing at this item
        generatorRepo.findAll().forEach(g -> {
            boolean dirty = false;
            if (g.isHasByProduct() &&
                    g.getByProduct().getItem().getId().equals(id)) {
                g.setByProduct(null);
                g.setHasByProduct(false);
                dirty = true;
            }
            if (g.getFuelItems().removeIf(d -> d.getItem().getId().equals(id))) {
                dirty = true;
            }
            if (dirty) {
                generatorRepo.save(g);
            }
        });

        // 5) now safe to delete the item itself
        itemRepository.delete(item);
    }
}
