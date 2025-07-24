package com.satisfactory.blueprint.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "images")
@Data
public class Image {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * MIME type, e.g. "image/png"
     */
    private String contentType;

    /**
     * Raw image bytes
     */
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] data;
}
