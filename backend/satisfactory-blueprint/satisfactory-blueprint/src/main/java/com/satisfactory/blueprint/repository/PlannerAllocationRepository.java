package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.PlannerAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlannerAllocationRepository extends JpaRepository<PlannerAllocation, Long> {
    // No extra methods needed for now
}
