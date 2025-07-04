package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.TransportItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransportItemRepository extends JpaRepository<TransportItem, Long> {

    /**
     * Retrieve all transport items assigned to a specific route.
     */
    List<TransportItem> findByRoute_Id(Long routeId);
}
