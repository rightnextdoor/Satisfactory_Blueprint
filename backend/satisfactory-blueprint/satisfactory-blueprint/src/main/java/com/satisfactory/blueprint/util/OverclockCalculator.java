package com.satisfactory.blueprint.util;

public class OverclockCalculator {
    /**
     * Exponent used to calculate energy-based power adjustment when scaling clock speed.
     * Derived from (log2(2.5) - 1) = 0.321928
     */
    private static final double ENERGY_EXPONENT = 0.321928;

    /**
     * Calculates the required building count (2-decimal precision) to achieve a fixed output at a given clock speed.
     *
     * Formula:
     *   count = rawCount * (100 / clockPercent)
     *
     * @param rawCount     Number of buildings required at 100% (totalOutput / rateAt100).
     * @param clockPercent Clock speed percentage (1.0000 - 250.0000).
     * @return Fractional building count rounded to 2 decimal places.
     */
    public static double calculateBuildingCount(double rawCount, double clockPercent) {
        double count = rawCount * 100.0 / clockPercent;
        return round(count, 2);
    }

    public static double calculateBurnTime(double baseBurnTime, double clockPercent) {
        double time = baseBurnTime * 100.0 / clockPercent;
        return round(time, 2);
    }

    public static double calculatePowerPerGenerator(double basePower, double clockPercent) {
        double scaledPower = basePower * (clockPercent / 100.0);
        return round(scaledPower, 2);
    }

    /**
     * Calculates the total power consumption for a fixed output at a given clock speed.
     *
     * Simplified formula:
     *   initialTotalPower = rawCount * basePower
     *   totalPower = initialTotalPower * (clockPercent / 100)^ENERGY_EXPONENT
     *
     * @param rawCount     Number of buildings required at 100% (totalOutput / rateAt100).
     * @param basePower    Base power draw per building at 100% (in MW).
     * @param clockPercent Clock speed percentage (1.0000 - 250.0000).
     * @return Total power consumption in MW, rounded to 2 decimal places.
     */
    public static double calculateTotalPower(double rawCount, double basePower, double clockPercent) {
        double initialTotalPower = rawCount * basePower;
        double totalPower = initialTotalPower * Math.pow(clockPercent / 100.0, ENERGY_EXPONENT);
        return round(totalPower, 2);
    }

    /**
     * Rounds a value to the specified number of decimal places.
     *
     * @param value    Value to round.
     * @param decimals Number of decimal places.
     * @return Rounded value.
     */
    private static double round(double value, int decimals) {
        double factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
}
