package com.satisfactory.blueprint.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.satisfactory.blueprint.dto.ImageUploadRequest;
import com.satisfactory.blueprint.entity.Building;
import com.satisfactory.blueprint.entity.Generator;
import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.entity.Recipe;
import com.satisfactory.blueprint.entity.embedded.ItemData;
import com.satisfactory.blueprint.entity.enums.BuildingType;
import com.satisfactory.blueprint.entity.enums.FuelType;
import com.satisfactory.blueprint.entity.enums.GeneratorType;
import com.satisfactory.blueprint.entity.enums.OwnerType;
import com.satisfactory.blueprint.repository.BuildingRepository;
import com.satisfactory.blueprint.repository.GeneratorRepository;
import com.satisfactory.blueprint.repository.ItemRepository;
import com.satisfactory.blueprint.repository.RecipeRepository;
import com.satisfactory.blueprint.service.ImageService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SeedDataLoader implements ApplicationRunner {

    private final ObjectMapper        mapper;
    private final ItemRepository      itemRepo;
    private final BuildingRepository  buildingRepo;
    private final GeneratorRepository generatorRepo;
    private final RecipeRepository    recipeRepo;
    private final ImageService imageService;

    public SeedDataLoader(ObjectMapper mapper,
                          ItemRepository itemRepo,
                          BuildingRepository buildingRepo,
                          GeneratorRepository generatorRepo,
                          RecipeRepository recipeRepo,
                          ImageService imageService) {
        this.mapper          = mapper;
        this.itemRepo        = itemRepo;
        this.buildingRepo    = buildingRepo;
        this.generatorRepo   = generatorRepo;
        this.recipeRepo      = recipeRepo;
        this.imageService    = imageService;
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
        record RawItem(String name, boolean resource, String iconFile) {}

        try (InputStream in = new ClassPathResource("seed/items.json").getInputStream()) {
            List<RawItem> raws = mapper.readValue(in, new TypeReference<>() {});
            for (RawItem raw : raws) {
                Item item = new Item();
                item.setName(raw.name());
                item.setResource(raw.resource());
                item = itemRepo.save(item);

                if (raw.iconFile() != null && !raw.iconFile().isBlank()) {
                    ClassPathResource res = new ClassPathResource("images/" + raw.iconFile());
                    try (InputStream is = res.getInputStream()) {
                        byte[] bytes = is.readAllBytes();
                        String base64 = Base64.getEncoder().encodeToString(bytes);
                        String ext = raw.iconFile().substring(raw.iconFile().lastIndexOf('.') + 1).toLowerCase();
                        String contentType = switch (ext) {
                            case "png" -> "image/png";
                            case "jpg", "jpeg" -> "image/jpeg";
                            case "webp" -> "image/webp";
                            default -> null;
                        };
                        ImageUploadRequest req = new ImageUploadRequest();
                        req.setData(base64);
                        req.setContentType(contentType);
                        req.setOwnerType(OwnerType.ITEM);
                        req.setOwnerId(item.getId());
                        req.setOldImageId(null);
                        imageService.saveImage(req);
                    }
                }
            }
            System.out.println("Seeded " + raws.size() + " items");
        }
    }

    private void seedBuildings() throws Exception {
        if (buildingRepo.count() > 0) return;
        record RawBuilding(String type, double powerUsage, String iconFile) {}

        try (InputStream in = new ClassPathResource("seed/buildings.json").getInputStream()) {
            List<RawBuilding> raws = mapper.readValue(in, new TypeReference<>() {});
            for (RawBuilding raw : raws) {
                Building b = new Building();
                b.setType(BuildingType.valueOf(raw.type()));
                b.setPowerUsage(raw.powerUsage());
                b = buildingRepo.save(b);

                if (raw.iconFile() != null && !raw.iconFile().isBlank()) {
                    ClassPathResource res = new ClassPathResource("images/" + raw.iconFile());
                    try (InputStream is = res.getInputStream()) {
                        byte[] bytes = is.readAllBytes();
                        String base64 = Base64.getEncoder().encodeToString(bytes);
                        String ext = raw.iconFile().substring(raw.iconFile().lastIndexOf('.') + 1).toLowerCase();
                        String contentType = switch (ext) {
                            case "png" -> "image/png";
                            case "jpg", "jpeg" -> "image/jpeg";
                            case "webp" -> "image/webp";
                            default -> null;
                        };
                        ImageUploadRequest req = new ImageUploadRequest();
                        req.setData(base64);
                        req.setContentType(contentType);
                        req.setOwnerType(OwnerType.BUILDING);
                        req.setOwnerId(b.getId());
                        req.setOldImageId(null);
                        imageService.saveImage(req);
                    }
                }
            }
            System.out.println("Seeded " + raws.size() + " buildings");
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
                String iconFile
        ) {}

        try (InputStream in = new ClassPathResource("seed/generators.json").getInputStream()) {
            List<RawGen> raws = mapper.readValue(in, new TypeReference<>() {});
            for (RawGen raw : raws) {
                Generator gen = new Generator();
                gen.setName(GeneratorType.valueOf(raw.name()));
                gen.setFuelType(FuelType.valueOf(raw.fuelType()));
                gen.setPowerOutput(raw.powerOutput());
                gen.setBurnTime(raw.burnTime());
                if (raw.hasByProduct()) {
                    Item bpItem = itemRepo.findByNameIgnoreCase(raw.byProduct().name())
                            .orElseThrow(() -> new IllegalStateException("By-product not found: " + raw.byProduct().name()));
                    ItemData bpData = new ItemData();
                    bpData.setItem(bpItem);
                    bpData.setAmount(raw.byProduct().amount());
                    gen.setByProduct(bpData);
                    gen.setHasByProduct(true);
                }
                gen.setFuelItems(raw.fuelItems().stream()
                        .map(rf -> {
                            Item fuelItem = itemRepo.findByNameIgnoreCase(rf.name())
                                    .orElseThrow(() -> new IllegalStateException("Fuel item not found: " + rf.name()));
                            ItemData data = new ItemData();
                            data.setItem(fuelItem);
                            data.setAmount(rf.amount());
                            return data;
                        })
                        .collect(Collectors.toList()));
                gen = generatorRepo.save(gen);

                if (raw.iconFile() != null && !raw.iconFile().isBlank()) {
                    ClassPathResource res = new ClassPathResource("images/" + raw.iconFile());
                    try (InputStream is = res.getInputStream()) {
                        byte[] bytes = is.readAllBytes();
                        String base64 = Base64.getEncoder().encodeToString(bytes);
                        String ext = raw.iconFile().substring(raw.iconFile().lastIndexOf('.') + 1).toLowerCase();
                        String contentType = switch (ext) {
                            case "png" -> "image/png";
                            case "jpg", "jpeg" -> "image/jpeg";
                            case "webp" -> "image/webp";
                            default -> null;
                        };
                        ImageUploadRequest req = new ImageUploadRequest();
                        req.setData(base64);
                        req.setContentType(contentType);
                        req.setOwnerType(OwnerType.GENERATOR);
                        req.setOwnerId(gen.getId());
                        req.setOldImageId(null);
                        imageService.saveImage(req);
                    }
                }
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
