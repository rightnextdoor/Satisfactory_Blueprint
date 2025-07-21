package com.satisfactory.blueprint.controller;

import com.satisfactory.blueprint.dto.ImageKeyRequest;
import com.satisfactory.blueprint.dto.ImageUploadRequest;
import com.satisfactory.blueprint.entity.Image;
import com.satisfactory.blueprint.service.ImageService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    /** Upload (or overwrite) an image. */
    @PostMapping("/upload")
    public ResponseEntity<Image> uploadImage(@RequestBody ImageUploadRequest req) {
        byte[] decoded = java.util.Base64.getDecoder().decode(req.getData());
        Image saved = imageService.saveImage(req.getKey(), decoded, req.getContentType());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /** Fetch raw image bytes by key. */
    @PostMapping("/get")
    public ResponseEntity<ByteArrayResource> getImage(@RequestBody ImageKeyRequest req) {
        Image img = imageService.getImage(req.getKey());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + img.getKey() + "\"")
                .contentType(MediaType.parseMediaType(img.getContentType()))
                .body(new ByteArrayResource(img.getData()));
    }

    /** Delete an image by key. */
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteImage(@RequestBody ImageKeyRequest req) {
        imageService.deleteImage(req.getKey());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/exists")
    public ResponseEntity<Map<String, Boolean>> exists(@RequestBody ImageKeyRequest req) {
        boolean present = imageService.exists(req.getKey());
        return ResponseEntity.ok(Map.of("exists", present));
    }
}
