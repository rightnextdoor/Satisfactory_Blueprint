package com.satisfactory.blueprint.entity;

import com.satisfactory.blueprint.entity.embedded.ImageAssignmentKey;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "image_assignment")
public class ImageAssignment {
    @EmbeddedId
    private ImageAssignmentKey id;

    // Optional: convenience link back to the Image entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "image_id",
            insertable = false, updatable = false
    )
    private Image image;

    public ImageAssignment() {}

    public ImageAssignment(ImageAssignmentKey id) {
        this.id = id;
    }

    public ImageAssignmentKey getId() {
        return id;
    }

    public void setId(ImageAssignmentKey id) {
        this.id = id;
    }

    public Image getImage() {
        return image;
    }
}
