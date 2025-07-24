package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.dto.ImageDto;
import com.satisfactory.blueprint.dto.ImageUploadRequest;

import com.satisfactory.blueprint.entity.Image;

import com.satisfactory.blueprint.entity.enums.OwnerType;
import com.satisfactory.blueprint.exception.ResourceNotFoundException;
import com.satisfactory.blueprint.repository.BuildingRepository;
import com.satisfactory.blueprint.repository.GeneratorRepository;
import com.satisfactory.blueprint.repository.ImageRepository;
import com.satisfactory.blueprint.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ImageService {

    private final ImageRepository           imageRepo;
    private final ImageAssignmentService    assignmentSvc;

    private final ItemRepository            itemRepo;
    private final BuildingRepository        buildingRepo;
    private final GeneratorRepository       generatorRepo;

    public ImageService(ImageRepository imageRepo,
                        ImageAssignmentService assignmentSvc,
                        ItemRepository itemRepo,
                        BuildingRepository buildingRepo,
                        GeneratorRepository generatorRepo) {
        this.imageRepo      = imageRepo;
        this.assignmentSvc  = assignmentSvc;
        this.itemRepo       = itemRepo;
        this.buildingRepo   = buildingRepo;
        this.generatorRepo  = generatorRepo;
    }

    /**
     * Handle both uploading a new image or reusing an existing one,
     * assign/unassign in image_assignment, then link the image
     * onto the actual owner entity.
     */
    public ImageDto saveImage(ImageUploadRequest req) {
        // 1) Create or lookup the Image row
        Image img;
        if (req.getData() != null && req.getContentType() != null) {
            img = new Image();
            byte[] bytes = Base64.getDecoder().decode(req.getData());
            img.setData(bytes);
            img.setContentType(req.getContentType());
            img = imageRepo.save(img);
        } else {
            UUID id = req.getId();
            img = imageRepo.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Image not found: " + id));
        }

        // 2) Assign new owner
        assignmentSvc.assign(img.getId(), req.getOwnerType(), req.getOwnerId());

        // 3) Unassign old owner if replacing
        UUID oldId = req.getOldImageId();
        if (oldId != null && !oldId.equals(img.getId())) {
            assignmentSvc.unassign(oldId, req.getOwnerType(), req.getOwnerId());
        }

        // 4) Link the Image onto its owner entity
        linkToOwner(req.getOwnerType(), req.getOwnerId(), img);

        // 5) Build and return DTO
        ImageDto dto = new ImageDto();
        dto.setId(img.getId());
        dto.setContentType(img.getContentType());
        dto.setData(img.getData());
        return dto;
    }

    /**
     * Unlink an image from its owner: clear the FK on the owner,
     * then remove the assignment row (and let assignmentSvc delete
     * the Image record if it was the last reference).
     */
    public void deleteImage(ImageUploadRequest req) {
        // 1) Clear the owner’s image FK
        unlinkFromOwner(req.getOwnerType(), req.getOwnerId());

        // 2) Remove the assignment
        assignmentSvc.unassign(req.getId(), req.getOwnerType(), req.getOwnerId());
    }

    @Transactional(readOnly = true)
    public ImageDto getImage(UUID id) {
        Image img = imageRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found: " + id));
        ImageDto dto = new ImageDto();
        dto.setId(img.getId());
        dto.setContentType(img.getContentType());
        dto.setData(img.getData());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<ImageDto> listAll() {
        return imageRepo.findAll().stream()
                .map(img -> {
                    ImageDto dto = new ImageDto();
                    dto.setId(img.getId());
                    dto.setContentType(img.getContentType());
                    dto.setData(null); // omit blob for listing
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // --- helper methods ---

    private void linkToOwner(OwnerType type, Long ownerId, Image img) {
        switch (type) {
            case ITEM -> itemRepo.findById(ownerId).ifPresent(item -> {
                item.setImage(img);
                itemRepo.save(item);
            });
            case BUILDING -> buildingRepo.findById(ownerId).ifPresent(b -> {
                b.setImage(img);
                buildingRepo.save(b);
            });
            case GENERATOR -> generatorRepo.findById(ownerId).ifPresent(g -> {
                g.setImage(img);
                generatorRepo.save(g);
            });
            // add other owner types here…
        }
    }

    private void unlinkFromOwner(OwnerType type, Long ownerId) {
        switch (type) {
            case ITEM -> itemRepo.findById(ownerId).ifPresent(item -> {
                item.setImage(null);
                itemRepo.save(item);
            });
            case BUILDING -> buildingRepo.findById(ownerId).ifPresent(b -> {
                b.setImage(null);
                buildingRepo.save(b);
            });
            case GENERATOR -> generatorRepo.findById(ownerId).ifPresent(g -> {
                g.setImage(null);
                generatorRepo.save(g);
            });
            // add other owner types here…
        }
    }
}
