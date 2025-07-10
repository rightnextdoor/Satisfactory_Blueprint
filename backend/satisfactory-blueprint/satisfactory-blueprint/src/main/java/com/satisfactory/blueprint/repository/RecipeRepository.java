package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.Building;
import com.satisfactory.blueprint.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    // look up all recipes by the built‐item’s name
    List<Recipe> findByItemToBuild_Item_NameIgnoreCase(String itemName);

    // find the first NON-alternate recipe by the built‐item’s name
    Optional<Recipe> findFirstByItemToBuild_Item_NameIgnoreCaseAndAlternateFalse(String itemName);
    Optional<Recipe> findFirstByItemToBuild_Item_NameIgnoreCaseAndAlternateTrue(String itemName);
    List<Recipe> findAllByBuilding(Building building);

    // in RecipeRepository.java

    Optional<Recipe> findFirstByItemToBuild_Item_NameIgnoreCaseAndAlternateFalseAndIdNot(String name, Long id);
    Optional<Recipe> findFirstByItemToBuild_Item_NameIgnoreCaseAndAlternateTrueAndIdNot(String name, Long id);

}
