package com.satisfactory.blueprint.entity.embedded;

import com.satisfactory.blueprint.entity.enums.OwnerType;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class ImageAssignmentKey implements Serializable {
    @Column(name = "image_id", nullable = false)
    private UUID imageId;

    @Enumerated(EnumType.STRING)
    @Column(name = "owner_type", nullable = false, length = 20)
    private OwnerType ownerType;

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    public ImageAssignmentKey() {}

    public ImageAssignmentKey(UUID imageId, OwnerType ownerType, Long ownerId) {
        this.imageId   = imageId;
        this.ownerType = ownerType;
        this.ownerId   = ownerId;
    }

    // getters & setters

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ImageAssignmentKey)) return false;
        ImageAssignmentKey that = (ImageAssignmentKey) o;
        return Objects.equals(imageId, that.imageId) &&
                ownerType == that.ownerType &&
                Objects.equals(ownerId, that.ownerId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(imageId, ownerType, ownerId);
    }
}
