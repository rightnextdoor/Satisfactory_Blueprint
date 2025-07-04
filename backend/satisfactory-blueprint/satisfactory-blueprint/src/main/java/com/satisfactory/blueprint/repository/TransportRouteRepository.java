package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.TransportRoute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransportRouteRepository extends JpaRepository<TransportRoute, Long> {

    /**
     * Retrieve all routes belonging to a specific transport plan.
     */
    List<TransportRoute> findByTransportPlan_Id(Long transportPlanId);
}
