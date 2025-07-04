package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.Planner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlannerRepository extends JpaRepository<Planner, Long> {

    /**
     * Fetch all planners ordered by last updated timestamp (most recent first).
     */
    List<Planner> findAllByOrderByUpdatedAtDesc();
}
