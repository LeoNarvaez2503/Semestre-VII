package com.kairosmix.infrastructure.mapper;

import com.kairosmix.domain.entities.CustomMix;
import com.kairosmix.infrastructure.rest.dto.CustomMixDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CustomMixMapperTest {

    @Autowired
    private CustomMixMapper customMixMapper;

    private CustomMix customMix;
    private CustomMixDTO customMixDTO;

    @BeforeEach
    void setUp() {
        customMix = CustomMix.builder()
            .id(1L)
            .name("Mezcla Premium")
            .description("Mezcla de frutos secos premium")
            .totalPrice(java.math.BigDecimal.valueOf(25.0))
            .build();

        customMixDTO = CustomMixDTO.builder()
            .id(1L)
            .name("Mezcla Premium")
            .description("Mezcla de frutos secos premium")
            .totalPrice(25.0)
            .build();
    }

    @Test
    void testEntityToDto() {
        CustomMixDTO result = customMixMapper.entityToDto(customMix);
        
        assertNotNull(result);
        assertEquals(customMix.getId(), result.getId());
        assertEquals(customMix.getName(), result.getName());
        assertEquals(customMix.getDescription(), result.getDescription());
        assertEquals(customMix.getTotalPrice().doubleValue(), result.getTotalPrice());
    }

    @Test
    void testEntityToDtoWithNull() {
        CustomMixDTO result = customMixMapper.entityToDto(null);
        assertNull(result);
    }

    @Test
    void testDtoToEntity() {
        CustomMix result = customMixMapper.dtoToEntity(customMixDTO);
        
        assertNotNull(result);
        assertEquals(customMixDTO.getId(), result.getId());
        assertEquals(customMixDTO.getName(), result.getName());
        assertEquals(customMixDTO.getDescription(), result.getDescription());
    }

    @Test
    void testDtoToEntityWithNull() {
        CustomMix result = customMixMapper.dtoToEntity(null);
        assertNull(result);
    }

    @Test
    void testMapperBidirectional() {
        CustomMixDTO dto = customMixMapper.entityToDto(customMix);
        CustomMix entityAgain = customMixMapper.dtoToEntity(dto);
        
        assertEquals(customMix.getName(), entityAgain.getName());
        assertEquals(customMix.getDescription(), entityAgain.getDescription());
        assertEquals(customMix.getTotalPrice(), entityAgain.getTotalPrice());
    }
}
