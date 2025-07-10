package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.entity.Planner;
import com.satisfactory.blueprint.entity.PlannerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlannerEntryRepository extends JpaRepository<PlannerEntry, Long> {
    Optional<PlannerEntry> findByTargetItem(Item item);
    void deleteAllByPlanner(Planner planner);
    List<PlannerEntry> findAllByRecipe_Id(Long recipeId);
}
