package com.satisfactory.blueprint.repository;

import com.satisfactory.blueprint.entity.ImageAssignment;
import com.satisfactory.blueprint.entity.embedded.ImageAssignmentKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;


public interface ImageAssignmentRepository
        extends JpaRepository<ImageAssignment, ImageAssignmentKey> {

    /**
     * Count how many assignments exist for a given image ID.
     */
    long countByIdImageId(UUID imageId);

}
