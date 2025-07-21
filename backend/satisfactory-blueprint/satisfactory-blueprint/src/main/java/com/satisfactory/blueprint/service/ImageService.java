package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.entity.Image;
import com.satisfactory.blueprint.exception.ResourceNotFoundException;
import com.satisfactory.blueprint.repository.ImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Transactional
public class ImageService {

    private final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    /**
     * Save or overwrite an image record from a MultipartFile.
     * Uses the file's original filename as the key.
     */
    public Image saveImage(String key, byte[] data, String contentType) {
        Image img = imageRepository.findById(key)
                .orElseGet(() -> {
                    Image newImg = new Image();
                    newImg.setKey(key);
                    return newImg;
                });
        img.setData(data);
        img.setContentType(contentType);
        return imageRepository.save(img);
    }

    /**
     * Retrieve an image by its key, or throw 404.
     */
    @Transactional(readOnly = true)
    public Image getImage(String key) {
        return imageRepository.findById(key)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Image not found: " + key));
    }

    /**
     * Delete an image by key, or throw 404.
     */
    public void deleteImage(String key) {
        if (!imageRepository.existsById(key)) {
            throw new ResourceNotFoundException("Image not found: " + key);
        }
        imageRepository.deleteById(key);
    }

    public boolean exists(String key) {

        if (key == null || key.isBlank()) {
            return false;
        }

        return imageRepository.existsByKey(key);
    }
}