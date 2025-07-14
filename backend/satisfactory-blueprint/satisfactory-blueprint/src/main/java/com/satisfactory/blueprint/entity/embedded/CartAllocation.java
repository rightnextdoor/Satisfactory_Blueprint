package com.satisfactory.blueprint.entity.embedded;

import com.satisfactory.blueprint.entity.Item;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class CartAllocation {

    private Integer cartIndex;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    private Double cartCapacity;
    private Double loadedQuantity;
}
