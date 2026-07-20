package com.kairosmix.infrastructure.rest.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kairosmix.domain.entities.Product;
import com.kairosmix.domain.ports.output.ProductRepositoryPort;
import com.kairosmix.application.usecases.CreateProductUseCase;
import com.kairosmix.application.usecases.UpdateProductUseCase;
import com.kairosmix.infrastructure.rest.dto.ProductDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepositoryPort productRepository;

    private ProductDTO testProductDTO;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProductDTO = ProductDTO.builder()
            .code("TC001")
            .name("Test Controller Product")
            .countryOfOrigin("Test Country")
            .pricePerPound(java.math.BigDecimal.valueOf(15.0))
            .wholesalePrice(java.math.BigDecimal.valueOf(12.0))
            .retailPrice(java.math.BigDecimal.valueOf(18.0))
            .initialStock(100)
            .currentStock(100)
            .build();

        testProduct = Product.builder()
            .code("TC002")
            .name("Existing Product")
            .countryOfOrigin("Test Country")
            .pricePerPound(java.math.BigDecimal.valueOf(20.0))
            .wholesalePrice(java.math.BigDecimal.valueOf(16.0))
            .retailPrice(java.math.BigDecimal.valueOf(24.0))
            .initialStock(50)
            .currentStock(50)
            .build();
    }

    /*
    @Test
    void testCreateProduct() throws Exception {
        mockMvc.perform(post("/v1/products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(testProductDTO)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.code").value("TEST-CTRL-001"))
            .andExpect(jsonPath("$.name").value("Test Controller Product"));
    }
    */

    @Test
    void testListProducts() throws Exception {
        mockMvc.perform(get("/v1/products")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void testGetProductById() throws Exception {
        Product saved = productRepository.save(testProduct);
        
        mockMvc.perform(get("/v1/products/" + saved.getId())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value("TC002"));
    }

    @Test
    void testGetProductByIdNotFound() throws Exception {
        mockMvc.perform(get("/v1/products/99999")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateProduct() throws Exception {
        Product saved = productRepository.save(testProduct);
        ProductDTO updateDTO = ProductDTO.builder()
            .code("TC002-UPD")
            .name("Updated Name")
            .countryOfOrigin("Updated Country")
            .pricePerPound(java.math.BigDecimal.valueOf(25.0))
            .wholesalePrice(java.math.BigDecimal.valueOf(20.0))
            .retailPrice(java.math.BigDecimal.valueOf(30.0))
            .initialStock(50)
            .currentStock(50)
            .build();

        mockMvc.perform(put("/v1/products/" + saved.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updateDTO)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Updated Name"));
    }

    @Test
    void testUpdateProductNotFound() throws Exception {
        ProductDTO updateDTO = ProductDTO.builder()
            .code("NOTFOUND")
            .name("Not Found")
            .countryOfOrigin("Test")
            .pricePerPound(java.math.BigDecimal.valueOf(10.0))
            .wholesalePrice(java.math.BigDecimal.valueOf(8.0))
            .retailPrice(java.math.BigDecimal.valueOf(12.0))
            .initialStock(0)
            .currentStock(0)
            .build();

        mockMvc.perform(put("/v1/products/99999")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updateDTO)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteProductNotFound() throws Exception {
        mockMvc.perform(delete("/v1/products/99999")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteProduct() throws Exception {
        Product saved = productRepository.save(testProduct);
        
        mockMvc.perform(delete("/v1/products/" + saved.getId())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());
    }
}
