
package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.entity.ImageAssignment;
import com.satisfactory.blueprint.entity.embedded.ImageAssignmentKey;
import com.satisfactory.blueprint.entity.enums.OwnerType;
import com.satisfactory.blueprint.repository.ImageAssignmentRepository;
import com.satisfactory.blueprint.repository.ImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class ImageAssignmentService {

    private final ImageAssignmentRepository assignmentRepo;
    private final ImageRepository        imageRepo;

    public ImageAssignmentService(ImageAssignmentRepository assignmentRepo,
                                  ImageRepository imageRepo) {
        this.assignmentRepo = assignmentRepo;
        this.imageRepo      = imageRepo;
    }

    /**
     * Link the given image to the specified owner.
     * If an assignment already exists, does nothing.
     */
    public void assign(UUID imageId, OwnerType ownerType, Long ownerId) {
        ImageAssignmentKey key =
                new ImageAssignmentKey(imageId, ownerType, ownerId);

        if (!assignmentRepo.existsById(key)) {
            assignmentRepo.save(new ImageAssignment(key));
        }
    }

    /**
     * Unlink the given image from the specified owner.
     * If that was the last assignment, delete the image itself.
     */
    public void unassign(UUID imageId, OwnerType ownerType, Long ownerId) {
        ImageAssignmentKey key =
                new ImageAssignmentKey(imageId, ownerType, ownerId);

        // Remove the specific link
        assignmentRepo.deleteById(key);

        // If nobody else is using this image, delete it
        long remaining = assignmentRepo.countByIdImageId(imageId);
        if (remaining == 0) {
            // also removes the blob data via cascade or LOB cleanup
            imageRepo.deleteById(imageId);
        }
    }
}
