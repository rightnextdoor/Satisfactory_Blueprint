package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.Generator;
import com.satisfactory.blueprint.entity.enums.GeneratorType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GeneratorRepository extends JpaRepository<Generator, Long> {

    /**
     * Find a Generator by its type.
     */
    Optional<Generator> findByName(GeneratorType name);
    /**
     * Check if a Generator of the given type already exists.
     */
    boolean existsByName(GeneratorType name);
}
