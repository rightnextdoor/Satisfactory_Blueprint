package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.*;
import com.satisfactory.blueprint.entity.Generator;
import com.satisfactory.blueprint.entity.Image;
import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.service.GeneratorService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/generators")
public class GeneratorController {

    private final GeneratorService generatorService;

    public GeneratorController(GeneratorService generatorService) {
        this.generatorService = generatorService;
    }

    /** List all generators */
    @GetMapping("/list")
    public List<GeneratorDto> listAll() {
        return generatorService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Get a single generator by ID */
    @PostMapping("/get")
    public GeneratorDto getById(@RequestBody IdRequest req) {
        return toDto(generatorService.findById(req.getId()));
    }

    /** Create a new generator */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public GeneratorDto create(@RequestBody GeneratorDto dto) {
        return toDto(generatorService.create(dto));
    }

    /** Update an existing generator */
    @PutMapping("/update")
    public GeneratorDto update(@RequestBody GeneratorDto dto) {
        return toDto(generatorService.update(dto.getId(), dto));
    }

    /** Delete a generator */
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestBody IdRequest req) {
        generatorService.delete(req.getId());
    }

    // --- mapping helpers ---

    private final Function<Image, ImageDto> mapImage = img -> {
        if (img == null) return null;
        ImageDto dto = new ImageDto();
        dto.setId(img.getId());
        dto.setContentType(img.getContentType());
        dto.setData(img.getData());
        return dto;
    };

    private GeneratorDto toDto(Generator gen) {
        GeneratorDto dto = new GeneratorDto();
        dto.setId(gen.getId());
        dto.setName(gen.getName());
        dto.setFuelType(gen.getFuelType());
        dto.setHasByProduct(gen.isHasByProduct());
        if (gen.isHasByProduct() && gen.getByProduct() != null) {
            dto.setByProduct(toDto(gen.getByProduct()));
        }
        dto.setPowerOutput(gen.getPowerOutput());
        dto.setBurnTime(gen.getBurnTime());
        // now map the Image entity instead of iconKey
        dto.setImage(mapImage.apply(gen.getImage()));
        dto.setFuelItems(
                gen.getFuelItems().stream()
                        .map(this::toDto)
                        .collect(Collectors.toList())
        );
        return dto;
    }

    private ItemDataDto toDto(ItemData data) {
        ItemDataDto dto = new ItemDataDto();
        dto.setAmount(data.getAmount());
        dto.setItem(toDto(data.getItem()));
        return dto;
    }

    private ItemDto toDto(Item item) {
        ItemDto dto = new ItemDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        // map the Image instead of iconKey
        dto.setImage(mapImage.apply(item.getImage()));
        dto.setResource(item.isResource());
        return dto;
    }
}
