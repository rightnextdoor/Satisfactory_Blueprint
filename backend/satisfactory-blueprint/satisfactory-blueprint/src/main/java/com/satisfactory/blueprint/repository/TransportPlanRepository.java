package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.TransportPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransportPlanRepository extends JpaRepository<TransportPlan, Long> {

    /**
     * Retrieve all transport plans associated with a given factory planner.
     */
    List<TransportPlan> findBySourcePlanner_Id(Long plannerId);
}
