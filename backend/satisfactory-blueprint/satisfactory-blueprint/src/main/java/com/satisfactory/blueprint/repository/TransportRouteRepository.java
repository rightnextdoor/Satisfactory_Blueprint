package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.TransportRoute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransportRouteRepository extends JpaRepository<TransportRoute, Long> {
    List<TransportRoute> findByTransportPlanId(Long planId);
}
