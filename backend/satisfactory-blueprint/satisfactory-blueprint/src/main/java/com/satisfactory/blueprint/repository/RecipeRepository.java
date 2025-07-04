package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    /**
     * Retrieve all recipes that produce the given item (by name, case-insensitive).
     */
    List<Recipe> findByItemToBuild_NameIgnoreCase(String itemName);

    /**
     * Retrieve the default (non-alternate) recipe for the given item.
     */
    Optional<Recipe> findFirstByItemToBuild_NameIgnoreCaseAndIsAlternateFalse(String itemName);
}
