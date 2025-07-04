package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.dto.ItemDto;
import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.exception.BadRequestException;
import com.satisfactory.blueprint.exception.ResourceNotFoundException;
import com.satisfactory.blueprint.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
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
        item.setAmount(dto.getAmount());
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
        existing.setAmount(dto.getAmount());
        existing.setResource(dto.isResource());
        return itemRepository.save(existing);
    }

    /**
     * Delete an item by ID. Throws 404 if not found.
     */
    public void delete(Long id) {
        Item existing = findById(id);
        itemRepository.delete(existing);
    }
}
