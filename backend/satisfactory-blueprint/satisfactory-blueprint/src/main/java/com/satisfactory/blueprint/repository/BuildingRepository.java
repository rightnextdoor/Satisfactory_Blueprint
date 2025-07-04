package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.Building;
import com.satisfactory.blueprint.entity.enums.BuildingType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BuildingRepository extends JpaRepository<Building, Long> {

    /**
     * Find a Building by its type.
     */
    Optional<Building> findByType(BuildingType type);
    /**
     * Check if a Building of the given type already exists.
     */
    boolean existsByType(BuildingType type);
}
