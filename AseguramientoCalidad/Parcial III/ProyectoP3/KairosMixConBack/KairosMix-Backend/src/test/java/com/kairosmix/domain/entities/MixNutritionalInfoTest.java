package com.kairosmix.domain.entities;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MixNutritionalInfoTest {

    @Test
    void toStringShouldHandleNulls() {
        MixNutritionalInfo info = new MixNutritionalInfo();
        String s = info.toString();
        assertNotNull(s);
        assertTrue(s.contains("0,00") || s.contains("0.00"));
    }

    @Test
    void toStringShouldPrintValues() {
        MixNutritionalInfo info = MixNutritionalInfo.builder()
            .calories(10.0)
            .protein(1.0)
            .fat(2.0)
            .carbs(3.0)
            .fiber(4.0)
            .build();

        String s = info.toString();
        assertTrue(s.contains("10"));
        assertTrue(s.contains("1"));
        assertTrue(s.contains("2"));
        assertTrue(s.contains("3"));
        assertTrue(s.contains("4"));
    }
}

