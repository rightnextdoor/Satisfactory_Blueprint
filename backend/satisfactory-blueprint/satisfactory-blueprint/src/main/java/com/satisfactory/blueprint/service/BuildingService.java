package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.dto.BuildingDto;
import com.satisfactory.blueprint.dto.ImageDto;
import com.satisfactory.blueprint.entity.Building;
import com.satisfactory.blueprint.entity.Image;
import com.satisfactory.blueprint.entity.Recipe;
import com.satisfactory.blueprint.entity.enums.BuildingType;
import com.satisfactory.blueprint.exception.BadRequestException;
import com.satisfactory.blueprint.exception.ResourceConflictException;
import com.satisfactory.blueprint.exception.ResourceNotFoundException;
import com.satisfactory.blueprint.repository.BuildingRepository;
import com.satisfactory.blueprint.repository.ImageRepository;
import com.satisfactory.blueprint.repository.RecipeRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final RecipeRepository recipeRepository;
    private final ImageRepository imageRepo;

    public BuildingService(BuildingRepository buildingRepository,
                           RecipeRepository recipeRepository,
                           ImageRepository imageRepo) {
        this.buildingRepository = buildingRepository;
        this.recipeRepository = recipeRepository;
        this.imageRepo    = imageRepo;
    }

    /**
     * Retrieve all buildings.
     */
    public List<Building> findAll() {
        return buildingRepository.findAll();
    }

    /**
     * Retrieve a single building by ID, or throw 404 if not found.
     */
    public Building findById(Long id) {
        return buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Building not found with id: " + id));
    }

    /**
     * Create a new building. Rejects duplicate types (400 Bad Request).
     */
    public Building create(BuildingDto buildingData) {
        BuildingType type = buildingData.getType();
        if (buildingRepository.existsByType(type)) {
            throw new BadRequestException(
                    "A building of type '" + type + "' already exists.");
        }

        Building toCreate = new Building();
        toCreate.setType(type);
        toCreate.setSortOrder(buildingData.getSortOrder());
        toCreate.setPowerUsage(buildingData.getPowerUsage());

        return buildingRepository.save(toCreate);
    }

    /**
     * Update an existing building by ID. Throws 404 if not found,
     * and 400 if changing to a type that already exists.
     */
    public Building update(BuildingDto updated) {
        Building existing = findById(updated.getId());

        // If type is changed, ensure new type isn't already used
        BuildingType newType = updated.getType();
        if (newType != existing.getType()
                && buildingRepository.existsByType(newType)) {
            throw new BadRequestException(
                    "A building of type '" + newType + "' already exists.");
        }
        existing.setType(newType);
        existing.setSortOrder(updated.getSortOrder());
        existing.setPowerUsage(updated.getPowerUsage());

        return buildingRepository.save(existing);
    }

    /**
     * Delete a building by ID. Throws 404 if not found.
     */
    public void delete(Long id) {
        Building toDelete = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Building not found: " + id));

        // 1) find and null‐out any recipes pointing here
        List<Recipe> linked = recipeRepository.findAllByBuilding(toDelete);
        for (Recipe r : linked) {
            r.setBuilding(null);
        }
        recipeRepository.saveAll(linked);

        // 2) now it’s safe to delete
        buildingRepository.delete(toDelete);
    }

}
