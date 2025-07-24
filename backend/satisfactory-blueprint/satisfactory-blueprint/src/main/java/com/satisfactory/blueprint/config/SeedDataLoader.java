package com.satisfactory.blueprint.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.satisfactory.blueprint.entity.*;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.entity.enums.BuildingType;
import com.satisfactory.blueprint.entity.enums.FuelType;
import com.satisfactory.blueprint.entity.enums.GeneratorType;
import com.satisfactory.blueprint.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
public class SeedDataLoader implements ApplicationRunner {

    private final ObjectMapper           mapper;
    private final ItemRepository         itemRepo;
    private final BuildingRepository     buildingRepo;
    private final GeneratorRepository    generatorRepo;
    private final RecipeRepository       recipeRepo;

    public SeedDataLoader(ObjectMapper mapper,
                          ItemRepository itemRepo,
                          BuildingRepository buildingRepo,
                          GeneratorRepository generatorRepo,
                          RecipeRepository recipeRepo ){
        this.mapper          = mapper;
        this.itemRepo        = itemRepo;
        this.buildingRepo    = buildingRepo;
        this.generatorRepo   = generatorRepo;
        this.recipeRepo      = recipeRepo;

    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        seedItems();
        seedBuildings();
        seedGenerators();
        seedRecipes();
    }

    private void seedItems() throws Exception {
        if (itemRepo.count() > 0) return;
        try (InputStream in = new ClassPathResource("seed/items.json").getInputStream()) {
            List<Item> items = mapper.readValue(in, new TypeReference<List<Item>>() {});
            itemRepo.saveAll(items);
            System.out.println("Seeded " + items.size() + " items");
        }
    }

    private void seedBuildings() throws Exception {
        if (buildingRepo.count() > 0) return;
        try (InputStream in = new ClassPathResource("seed/buildings.json").getInputStream()) {
            List<Building> buildings = mapper.readValue(in, new TypeReference<List<Building>>() {});
            buildingRepo.saveAll(buildings);
            System.out.println("Seeded " + buildings.size() + " buildings");
        }
    }

    private void seedGenerators() throws Exception {
        if (generatorRepo.count() > 0) return;

        record RawFuel(String name, double amount) {}
        record RawGen(
                String name,
                String fuelType,
                boolean hasByProduct,
                RawFuel byProduct,
                double powerOutput,
                double burnTime,
                List<RawFuel> fuelItems,
                String iconKey
        ) {}

        try (InputStream in = new ClassPathResource("seed/generators.json").getInputStream()) {
            List<RawGen> raws = mapper.readValue(in, new TypeReference<List<RawGen>>() {});
            for (RawGen raw : raws) {
                Generator gen = new Generator();
                // core fields
                gen.setName(GeneratorType.valueOf(raw.name()));
                gen.setFuelType(FuelType.valueOf(raw.fuelType()));
                gen.setPowerOutput(raw.powerOutput());
                gen.setBurnTime(raw.burnTime());
//                gen.setIconKey(raw.iconKey());

                // by‐product
                if (raw.hasByProduct()) {
                    Item bpItem = itemRepo.findByNameIgnoreCase(raw.byProduct().name())
                            .orElseThrow(() -> new IllegalStateException("By-product not found: " + raw.byProduct().name()));
                    ItemData bpData = new ItemData();
                    bpData.setItem(bpItem);
                    bpData.setAmount(raw.byProduct().amount());
                    gen.setByProduct(bpData);
                    gen.setHasByProduct(true);
                } else {
                    gen.setHasByProduct(false);
                    gen.setByProduct(null);
                }

                // fuel items
                List<ItemData> fuelData = raw.fuelItems().stream()
                        .map(rf -> {
                            Item fuelItem = itemRepo.findByNameIgnoreCase(rf.name())
                                    .orElseThrow(() -> new IllegalStateException("Fuel item not found: " + rf.name()));
                            ItemData data = new ItemData();
                            data.setItem(fuelItem);
                            data.setAmount(rf.amount());
                            return data;
                        })
                        .toList();
                gen.setFuelItems(fuelData);

                generatorRepo.save(gen);
            }
            System.out.println("Seeded " + raws.size() + " generators");
        }
    }

    private void seedRecipes() throws Exception {
        if (recipeRepo.count() > 0) return;

        record RawBuilding(BuildingType type) {}
        record RawItem(String name, double amount) {}
        record RawRecipe(
                boolean alternate,
                boolean spaceElevator,
                boolean fuel,
                boolean weaponOrTool,
                boolean hasByProduct,
                int tier,
                RawBuilding building,
                RawItem itemToBuild,
                List<RawItem> items,
                RawItem byProduct
        ) {}

        try (InputStream in = new ClassPathResource("seed/recipes.json").getInputStream()) {
            List<RawRecipe> raws = mapper.readValue(in, new TypeReference<List<RawRecipe>>() {});
            for (RawRecipe raw : raws) {
                Recipe recipe = new Recipe();
                // core flags
                recipe.setAlternate(raw.alternate());
                recipe.setSpaceElevator(raw.spaceElevator());
                recipe.setFuel(raw.fuel());
                recipe.setWeaponOrTool(raw.weaponOrTool());
                recipe.setHasByProduct(raw.hasByProduct());
                recipe.setTier(raw.tier());

                // building
                Building b = buildingRepo.findByType(raw.building().type())
                        .orElseThrow(() -> new IllegalStateException("Building not found: " + raw.building().type()));
                recipe.setBuilding(b);

                // output (itemToBuild)
                Item out = itemRepo.findByNameIgnoreCase(raw.itemToBuild().name())
                        .orElseThrow(() -> new IllegalStateException("Output item not found: " + raw.itemToBuild().name()));
                ItemData outData = new ItemData();
                outData.setItem(out);
                outData.setAmount(raw.itemToBuild().amount());
                recipe.setItemToBuild(outData);

                // ingredients
                List<ItemData> ingredients = raw.items().stream()
                        .map(ri -> {
                            Item ing = itemRepo.findByNameIgnoreCase(ri.name())
                                    .orElseThrow(() -> new IllegalStateException("Ingredient not found: " + ri.name()));
                            ItemData data = new ItemData();
                            data.setItem(ing);
                            data.setAmount(ri.amount());
                            return data;
                        })
                        .toList();
                recipe.setItems(ingredients);

                // by‐product
                if (raw.hasByProduct() && raw.byProduct() != null) {
                    Item bp = itemRepo.findByNameIgnoreCase(raw.byProduct().name())
                            .orElseThrow(() -> new IllegalStateException("By-product not found: " + raw.byProduct().name()));
                    ItemData bpData = new ItemData();
                    bpData.setItem(bp);
                    bpData.setAmount(raw.byProduct().amount());
                    recipe.setByProduct(bpData);
                } else {
                    recipe.setByProduct(null);
                }

                recipeRepo.save(recipe);
            }
            System.out.println("Seeded " + raws.size() + " recipes");
        }
    }
}
