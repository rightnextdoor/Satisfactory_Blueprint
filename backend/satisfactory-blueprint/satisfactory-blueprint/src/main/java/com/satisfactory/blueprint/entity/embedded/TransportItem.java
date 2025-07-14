package com.satisfactory.blueprint.entity.embedded;

import com.satisfactory.blueprint.entity.Item;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportItem {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    /** how many units you want to move */
    @Column(name = "target_quantity", nullable = false)
    private double targetQuantity;

    /** how many units are already covered by routes */
    @Column(name = "covered_quantity", nullable = false)
    private double coveredQuantity;
}
