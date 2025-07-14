package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.dto.*;
import com.satisfactory.blueprint.entity.Planner;
import org.springframework.stereotype.Service;

@Service
public class PlannerMapper {
    public PlannerDto toDto(Planner p) {
        PlannerDto d = new PlannerDto();
        d.setId(p.getId());
        d.setName(p.getName());
        d.setMode(p.getMode());
        d.setGenerator(new GeneratorDto(p.getGenerator().getId(), p.getGenerator().getName()));
        d.setTargetType(p.getTargetType());
        d.setTargetAmount(p.getTargetAmount());
        d.setCreatedAt(p.getCreatedAt());
        d.setUpdatedAt(p.getUpdatedAt());
        d.setResources(
                p.getResources().stream()
                        .map(r -> {
                            var x = new ItemDataDto();
                            x.setItemId(r.getItem().getId());
                            x.setItemName(r.getItem().getName());
                            x.setAmount(r.getAmount());
                            return x;
                        })
                        .toList()
        );
        d.setEntries(
                p.getEntries().stream().map(e -> {
                    var ed = new PlannerEntryDto();
                    ed.setId(e.getId());
                    ed.setTargetItem(new ItemDto(e.getTargetItem().getId(), e.getTargetItem().getName()));
                    ed.setRecipe(new RecipeDto(e.getRecipe().getId(), e.getRecipe().getItemToBuild().getItem().getName()));
                    ed.setBuildingCount(e.getBuildingCount());
                    ed.setOutgoingAmount(e.getOutgoingAmount());
                    ed.setIngredientAllocations(
                            e.getIngredientAllocations().stream().map(id -> {
                                var idto = new ItemDataDto();
                                idto.setItemId(id.getItem().getId());
                                idto.setItemName(id.getItem().getName());
                                idto.setAmount(id.getAmount());
                                return idto;
                            }).toList()
                    );
                    ed.setRecipeAllocations(
                            e.getRecipeAllocations().stream().map(a -> {
                                var ad = new PlannerAllocationDto();
                                ad.setLabel(a.getLabel());
                                ad.setItemId(a.getItem().getId());
                                ad.setAmount(a.getAmount());
                                ad.setBuildingCount(a.getBuildingCount());
                                return ad;
                            }).toList()
                    );
                    ed.setManualAllocations(
                            e.getManualAllocations().stream().map(a -> {
                                var ad = new PlannerAllocationDto();
                                ad.setLabel(a.getLabel());
                                ad.setItemId(a.getItem() == null ? null : a.getItem().getId());
                                ad.setAmount(a.getAmount());
                                ad.setBuildingCount(a.getBuildingCount());
                                return ad;
                            }).toList()
                    );
                    return ed;
                }).toList()
        );
        return d;
    }
}
