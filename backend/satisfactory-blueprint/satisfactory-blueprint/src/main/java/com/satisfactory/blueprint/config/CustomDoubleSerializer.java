package com.satisfactory.blueprint.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdScalarSerializer;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;

public class CustomDoubleSerializer extends StdScalarSerializer<Double> {

    public CustomDoubleSerializer() {
        super(Double.class);
    }

    @Override
    public void serialize(Double value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        if (value == null) {
            gen.writeNull();
            return;
        }
        long asLong = value.longValue();
        if (Double.compare(value, asLong) == 0) {
            // whole number → no decimal
            gen.writeNumber(asLong);
        } else {
            // round to 2 decimal places
            BigDecimal bd = BigDecimal.valueOf(value)
                    .setScale(2, RoundingMode.HALF_UP)
                    .stripTrailingZeros();
            gen.writeNumber(bd);
        }
    }
}
