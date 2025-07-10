package com.satisfactory.blueprint.entity.embedded;

import com.satisfactory.blueprint.entity.Item;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Embeddable
public class ItemData {
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;
    @Column(name = "amount", nullable = false)
    private double amount;
}
