package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.ImageDto;
import com.satisfactory.blueprint.dto.ImageUploadRequest;
import com.satisfactory.blueprint.service.ImageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartHttpServletRequest;


import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private static final Logger log = LoggerFactory.getLogger(ImageController.class);
    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping("/list")
    public ResponseEntity<List<ImageDto>> listAll() {
        List<ImageDto> images = imageService.listAll();
        return ResponseEntity.ok(images);
    }

    /**
     * Upload a new image (data + contentType) or reuse an existing one (data==null && id!=null),
     * link it to ownerType/ownerId, and unlink oldImageId if provided.
     */
    @PostMapping("/upload")
    public ResponseEntity<ImageDto> uploadImage(@RequestBody ImageUploadRequest req) {
        log.info("uploadImage called → id={}, oldImageId={}, ownerType={}, ownerId={}",
                req.getId(), req.getOldImageId(), req.getOwnerType(), req.getOwnerId());
        ImageDto saved = imageService.saveImage(req);
        log.info("uploadImage completed → new image UUID {}", saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Fetch a full ImageDto (including blob data) by its UUID.
     * Expects JSON: { "id": "<uuid>" }
     */
    @PostMapping("/get")
    public ResponseEntity<ImageDto> getImage(@RequestBody Map<String, UUID> payload) {
        UUID id = payload.get("id");
        log.debug("getImage called → id={}", id);
        ImageDto dto = imageService.getImage(id);
        return ResponseEntity.ok(dto);
    }

    /**
     * Unlink (and possibly delete) an image from its owner.
     * Expects the same ImageUploadRequest shape (id, oldImageId, ownerType, ownerId).
     */
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteImage(@RequestBody ImageUploadRequest req) {
        log.info("deleteImage called → id={}, oldImageId={}, ownerType={}, ownerId={}",
                req.getId(), req.getOldImageId(), req.getOwnerType(), req.getOwnerId());
        imageService.deleteImage(req);
        log.info("deleteImage completed for image {}", req.getId());
        return ResponseEntity.noContent().build();
    }
}
