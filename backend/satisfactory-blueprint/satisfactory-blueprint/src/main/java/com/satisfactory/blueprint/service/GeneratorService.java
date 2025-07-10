package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.dto.GeneratorDto;
import com.satisfactory.blueprint.dto.ItemDataDto;
import com.satisfactory.blueprint.entity.Generator;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.entity.enums.FuelType;
import com.satisfactory.blueprint.exception.ResourceNotFoundException;
import com.satisfactory.blueprint.repository.GeneratorRepository;
import com.satisfactory.blueprint.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

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

    public List<Generator> findAll() {
        return generatorRepository.findAll();
    }

    public Generator findById(Long id) {
        return generatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Generator not found with id: " + id));
    }

    public Generator create(GeneratorDto dto) {
        Generator gen = new Generator();
        populateGenerator(gen, dto);
        return generatorRepository.save(gen);
    }

    public Generator update(Long id, GeneratorDto dto) {
        Generator gen = generatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Generator not found with id: " + id));
        populateGenerator(gen, dto);
        return generatorRepository.save(gen);
    }

    public void delete(Long id) {
        Generator existing = findById(id);
        generatorRepository.delete(existing);
    }

    private void populateGenerator(Generator gen, GeneratorDto dto) {
        // core scalar fields
        gen.setName(dto.getName());
        String rawFuel = dto.getFuelType() != null
                ? dto.getFuelType().name()
                : null;
        FuelType fuelType = FuelType.from(rawFuel);
        gen.setFuelType(fuelType);
        gen.setPowerOutput(dto.getPowerOutput());
        gen.setBurnTime(dto.getBurnTime());
        gen.setIconKey(dto.getIconKey());

        // by-product
        if (dto.getByProduct() != null) {
            gen.setHasByProduct(true);
            gen.setByProduct(toItemData(dto.getByProduct()));
        } else {
            gen.setHasByProduct(false);
            gen.setByProduct(null);             // clear old byProduct on update
        }

        // fuel items
        List<ItemData> newFuel = Optional.ofNullable(dto.getFuelItems())
                .orElse(Collections.emptyList())
                .stream()
                .map(this::toItemData)
                .collect(Collectors.toList());
        gen.getFuelItems().clear();
        gen.getFuelItems().addAll(newFuel);

        // validate against the newly assembled list
        fuelValidator.validate(
                gen,
                newFuel.stream()
                        .map(ItemData::getItem)
                        .collect(Collectors.toList())
        );
    }

    private ItemData toItemData(ItemDataDto dto) {
        ItemData data = new ItemData();
        data.setItem(
                itemRepository.findById(dto.getItem().getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Fuel-item not found: " + dto.getItem().getId()))
        );
        data.setAmount(dto.getAmount());
        return data;
    }
}
