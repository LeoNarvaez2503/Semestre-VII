package com.kairosmix.infrastructure.rest.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kairosmix.domain.entities.CustomMix;
import com.kairosmix.domain.ports.output.CustomMixRepositoryPort;
import com.kairosmix.infrastructure.rest.dto.CustomMixDTO;
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
public class CustomMixControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomMixRepositoryPort customMixRepository;

    private CustomMixDTO testCustomMixDTO;
    private CustomMix testCustomMix;

    @BeforeEach
    void setUp() {
        testCustomMixDTO = CustomMixDTO.builder()
            .name("Test Mix Controller")
            .description("Test mix for controller")
            .totalPrice(22.0)
            .build();

        testCustomMix = CustomMix.builder()
            .name("Existing Mix")
            .description("Existing mix description")
            .totalPrice(java.math.BigDecimal.valueOf(20.0))
            .build();
    }

    /*
    @Test
    void testCreateCustomMix() throws Exception {
        mockMvc.perform(post("/v1/custom-mixes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(testCustomMixDTO)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Test Mix Controller"));
    }
    */

    @Test
    void testListCustomMixes() throws Exception {
        mockMvc.perform(get("/v1/custom-mixes")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void testGetCustomMixById() throws Exception {
        CustomMix saved = customMixRepository.save(testCustomMix);
        
        mockMvc.perform(get("/v1/custom-mixes/" + saved.getId())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Existing Mix"));
    }

    @Test
    void testGetCustomMixByIdNotFound() throws Exception {
        mockMvc.perform(get("/v1/custom-mixes/99999")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    void testGetCustomMixesByClient() throws Exception {
        CustomMix saved = customMixRepository.save(testCustomMix);
        
        mockMvc.perform(get("/v1/custom-mixes/client/99999")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    /*
    @Test
    void testDeleteCustomMix() throws Exception {
        CustomMix saved = customMixRepository.save(testCustomMix);
        
        mockMvc.perform(delete("/v1/custom-mixes/" + saved.getId())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }
    */

    @Test
    void testDeleteCustomMixNotFound() throws Exception {
        mockMvc.perform(delete("/v1/custom-mixes/99999")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }
}
