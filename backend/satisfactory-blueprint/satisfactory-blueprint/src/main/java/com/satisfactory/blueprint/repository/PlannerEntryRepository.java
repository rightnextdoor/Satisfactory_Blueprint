package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.PlannerEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlannerEntryRepository extends JpaRepository<PlannerEntry, Long> {

    /**
     * Retrieve all entries belonging to a specific planner.
     */
    List<PlannerEntry> findByPlanner_Id(Long plannerId);
}
