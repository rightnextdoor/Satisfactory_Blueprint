package com.satisfactory.blueprint.entity.embedded;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class PlanItem {

    private Long itemId;              // reference to item
    private String itemName;          // optional for display
    private Double targetQuantity;    // amount to transport
    private Double coveredQuantity;   // sum of assigned so far
}
