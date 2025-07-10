package com.satisfactory.blueprint.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "images")
@Data
public class Image {

    /**
     * A short key, e.g. "iron-ore.png" or UUID string
     */
    @Id
    @Column(name = "`key`", nullable = false)
    private String key;

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
