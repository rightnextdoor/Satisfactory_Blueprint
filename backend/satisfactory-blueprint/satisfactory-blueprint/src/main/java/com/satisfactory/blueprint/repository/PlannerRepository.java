package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.entity.Planner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PlannerRepository extends JpaRepository<Planner, Long> {
    boolean existsByEntries_Recipe_Id(Long recipeId);
    List<Planner> findByEntries_Recipe_Id(Long recipeId);

}
