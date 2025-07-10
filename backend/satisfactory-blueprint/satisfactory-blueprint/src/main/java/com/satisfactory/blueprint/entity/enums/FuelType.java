package com.satisfactory.blueprint.entity.enums;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum FuelType {
    COAL,
    COMPACTED_COAL,
    PETROLEUM_COKE,
    WATER,
    FUEL,
    LIQUID_BIOFUEL,
    TURBOFUEL,
    ROCKET_FUEL,
    IONIZED_FUEL,
    URANIUM_FUEL_ROD,
    PLUTONIUM_FUEL_ROD,
    FICSONIUM_FUEL_ROD,
    BIOMASS,
    SOLID_BIOFUEL,
    WOOD,
    LEAVES,
    GEOTHERMAL;
    public static FuelType from(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("fuelType must be provided");
        }
        try {
            return valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid fuelType '" + raw + "'.  Must be one of: " +
                            Arrays.stream(values())
                                    .map(Enum::name)
                                    .collect(Collectors.joining(", "))
            );
        }
    }
}
