package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {

    /**
     * Find an Item by its name (case-insensitive).
     */
    Optional<Item> findByNameIgnoreCase(String name);

    /**
     * Check existence by name.
     */
    boolean existsByNameIgnoreCase(String name);
}
