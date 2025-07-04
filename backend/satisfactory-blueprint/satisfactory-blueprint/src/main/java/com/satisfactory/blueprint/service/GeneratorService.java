package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.dto.GeneratorDto;
import com.satisfactory.blueprint.entity.Generator;
import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.exception.BadRequestException;
import com.satisfactory.blueprint.exception.ResourceNotFoundException;
import com.satisfactory.blueprint.repository.GeneratorRepository;
import com.satisfactory.blueprint.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GeneratorService {

    private final GeneratorRepository generatorRepository;
    private final ItemRepository itemRepository;
    private final GeneratorFuelValidator fuelValidator;

    public GeneratorService(GeneratorRepository generatorRepository,
                            ItemRepository itemRepository,
                            GeneratorFuelValidator fuelValidator) {
        this.generatorRepository = generatorRepository;
        this.itemRepository = itemRepository;
        this.fuelValidator = fuelValidator;
    }

    /** Retrieve all generators */
    public List<Generator> findAll() {
        return generatorRepository.findAll();
    }

    /** Retrieve one generator by ID, or throw 404 */
    public Generator findById(Long id) {
        return generatorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Generator not found with id: " + id));
    }

    /**
     * Create a new generator from DTO.
     * - Reject if a generator of this type already exists.
     * - Validate its fuelItems against the GeneratorType’s allowed fuels.
     */
    public Generator create(GeneratorDto dto) {
        if (generatorRepository.existsByName(dto.getName())) {
            throw new BadRequestException(
                    "A generator of type '" + dto.getName() + "' already exists.");
        }

        // Build new entity
        Generator toSave = new Generator();
        toSave.setName(dto.getName());
        toSave.setHasByProduct(dto.isHasByProduct());

        if (dto.isHasByProduct()) {
            Item byProd = itemRepository.findById(dto.getByProduct().getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("By-product item not found: " + dto.getByProduct().getId()));
            toSave.setByProduct(byProd);
        }

        toSave.setPowerOutput(dto.getPowerOutput());
        toSave.setBurnTime(dto.getBurnTime());
        toSave.setIconKey(dto.getIconKey());

        // Resolve fuel items
        List<Item> fuels = dto.getFuelItems().stream()
                .map(itemDto -> itemRepository.findById(itemDto.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Fuel item not found: " + itemDto.getId())))
                .collect(Collectors.toList());

        // Validate allowed fuels
        fuelValidator.validate(toSave, fuels);
        toSave.setFuelItems(fuels);

        return generatorRepository.save(toSave);
    }

    /**
     * Update an existing generator from DTO.
     * - Reject if changing to a type that already exists.
     * - Re-validate the new fuelItems.
     */
    public Generator update(Long id, GeneratorDto dto) {
        Generator existing = findById(id);

        if (dto.getName() != existing.getName()
                && generatorRepository.existsByName(dto.getName())) {
            throw new BadRequestException(
                    "A generator of type '" + dto.getName() + "' already exists.");
        }

        existing.setName(dto.getName());
        existing.setHasByProduct(dto.isHasByProduct());

        if (dto.isHasByProduct()) {
            Item byProd = itemRepository.findById(dto.getByProduct().getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("By-product item not found: " + dto.getByProduct().getId()));
            existing.setByProduct(byProd);
        } else {
            existing.setByProduct(null);
        }

        existing.setPowerOutput(dto.getPowerOutput());
        existing.setBurnTime(dto.getBurnTime());
        existing.setIconKey(dto.getIconKey());

        // Resolve and validate fuel items
        List<Item> fuels = dto.getFuelItems().stream()
                .map(itemDto -> itemRepository.findById(itemDto.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Fuel item not found: " + itemDto.getId())))
                .collect(Collectors.toList());

        fuelValidator.validate(existing, fuels);
        existing.setFuelItems(fuels);

        return generatorRepository.save(existing);
    }

    /** Delete a generator by ID, or throw 404 if not found */
    public void delete(Long id) {
        Generator existing = findById(id);
        generatorRepository.delete(existing);
    }
}
