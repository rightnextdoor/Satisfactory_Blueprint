package com.satisfactory.blueprint.service;

import com.satisfactory.blueprint.entity.Generator;
import com.satisfactory.blueprint.entity.Item;
import com.satisfactory.blueprint.entity.enums.FuelType;
import com.satisfactory.blueprint.entity.enums.GeneratorType;
import com.satisfactory.blueprint.exception.BadRequestException;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class GeneratorFuelValidator {

    private static final Map<GeneratorType, Set<FuelType>> ALLOWED = new EnumMap<>(GeneratorType.class);

    static {
        ALLOWED.put(GeneratorType.COAL_GENERATOR,
                Set.of(FuelType.COAL, FuelType.COMPACTED_COAL, FuelType.PETROLEUM_COKE));
        ALLOWED.put(GeneratorType.FUEL_GENERATOR,
                Set.of(FuelType.FUEL, FuelType.LIQUID_BIOFUEL, FuelType.TURBOFUEL,
                        FuelType.ROCKET_FUEL, FuelType.IONIZED_FUEL));
        ALLOWED.put(GeneratorType.NUCLEAR_REACTOR,
                Set.of(FuelType.URANIUM_FUEL_ROD, FuelType.PLUTONIUM_FUEL_ROD, FuelType.FICSONIUM_FUEL_ROD));
        ALLOWED.put(GeneratorType.BIOMASS_BURNER,
                Set.of(FuelType.BIOMASS, FuelType.SOLID_BIOFUEL, FuelType.WOOD, FuelType.LEAVES));
        ALLOWED.put(GeneratorType.GEOTHERMAL_GENERATOR,
                Set.of()); // no fuel items required
    }

    /**
     * Validates that each Item’s name corresponds to a FuelType,
     * and that it’s allowed for this generator’s type.
     */
    public void validate(Generator generator, List<Item> fuelItems) {
        Set<FuelType> allowedFuelTypes = ALLOWED.getOrDefault(generator.getName(), Set.of());
        for (Item item : fuelItems) {
            // Normalize name to enum constant style:
            String key = item.getName().toUpperCase().replace(' ', '_').replace('-', '_');
            FuelType ft;
            try {
                ft = FuelType.valueOf(key);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException(
                        "Item '" + item.getName() + "' is not a recognized fuel type");
            }
            if (!allowedFuelTypes.contains(ft)) {
                throw new BadRequestException(
                        "Fuel item '" + item.getName() + "' (" + ft +
                                ") is not valid for generator type '" + generator.getName() + "'");
            }
        }
    }
}
