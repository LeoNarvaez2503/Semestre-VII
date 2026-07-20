package com.kairosmix.infrastructure.mapper;

import com.kairosmix.domain.entities.Product;
import com.kairosmix.infrastructure.rest.dto.ProductDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ProductMapperTest {

    @Autowired
    private ProductMapper productMapper;

    private Product product;
    private ProductDTO productDTO;

    @BeforeEach
    void setUp() {
        product = Product.builder()
            .id(1L)
            .code("ALM-001")
            .name("Almendras Premium")
            .countryOfOrigin("España")
            .pricePerPound(java.math.BigDecimal.valueOf(15.0))
            .wholesalePrice(java.math.BigDecimal.valueOf(12.0))
            .retailPrice(java.math.BigDecimal.valueOf(18.0))
            .initialStock(100)
            .currentStock(80)
            .build();

        productDTO = ProductDTO.builder()
            .id(1L)
            .code("ALM-001")
            .name("Almendras Premium")
            .countryOfOrigin("España")
            .pricePerPound(java.math.BigDecimal.valueOf(15.0))
            .wholesalePrice(java.math.BigDecimal.valueOf(12.0))
            .retailPrice(java.math.BigDecimal.valueOf(18.0))
            .initialStock(100)
            .currentStock(80)
            .build();
    }

    @Test
    void testEntityToDto() {
        ProductDTO result = productMapper.entityToDto(product);
        
        assertNotNull(result);
        assertEquals(product.getId(), result.getId());
        assertEquals(product.getCode(), result.getCode());
        assertEquals(product.getName(), result.getName());
        assertEquals(product.getCountryOfOrigin(), result.getCountryOfOrigin());
        assertEquals(product.getPricePerPound(), result.getPricePerPound());
    }

    @Test
    void testEntityToDtoWithNull() {
        ProductDTO result = productMapper.entityToDto(null);
        assertNull(result);
    }

    @Test
    void testDtoToEntity() {
        Product result = productMapper.dtoToEntity(productDTO);
        
        assertNotNull(result);
        assertEquals(productDTO.getId(), result.getId());
        assertEquals(productDTO.getCode(), result.getCode());
        assertEquals(productDTO.getName(), result.getName());
        assertEquals(productDTO.getCountryOfOrigin(), result.getCountryOfOrigin());
    }

    @Test
    void testDtoToEntityWithNull() {
        Product result = productMapper.dtoToEntity(null);
        assertNull(result);
    }

    @Test
    void testMapperBidirectional() {
        ProductDTO dto = productMapper.entityToDto(product);
        Product entityAgain = productMapper.dtoToEntity(dto);
        
        assertEquals(product.getCode(), entityAgain.getCode());
        assertEquals(product.getName(), entityAgain.getName());
        assertEquals(product.getPricePerPound(), entityAgain.getPricePerPound());
    }
}
