package com.kairosmix.infrastructure.rest.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kairosmix.domain.entities.Client;
import com.kairosmix.domain.ports.output.ClientRepositoryPort;
import com.kairosmix.infrastructure.rest.dto.ClientDTO;
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
public class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ClientRepositoryPort clientRepository;

    private ClientDTO testClientDTO;
    private Client testClient;

    @BeforeEach
    void setUp() {
        testClientDTO = ClientDTO.builder()
            .documentId("DOC-CTRL-CREATE1")
            .documentType("CEDULA")
            .name("Test Client Corp")
            .email("test@corp.com")
            .phone("1234567890")
            .address("Test Street 123")
            .city("Quito")
            .build();

        testClient = Client.builder()
            .documentId("DOC-CTRL-EXIST1")
            .documentType(Client.DocumentType.CEDULA)
            .name("Existing Client")
            .email("existing@corp.com")
            .phone("0987654321")
            .address("Existing Street 456")
            .city("Guayaquil")
            .build();
    }

    @Test
    void testCreateClient() throws Exception {
        mockMvc.perform(post("/v1/clients")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(testClientDTO)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Test Client Corp"))
            .andExpect(jsonPath("$.email").value("test@corp.com"));
    }

    @Test
    void testListClients() throws Exception {
        mockMvc.perform(get("/v1/clients")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void testGetClientById() throws Exception {
        Client saved = clientRepository.save(testClient);

        mockMvc.perform(get("/v1/clients/" + saved.getId())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Existing Client"));
    }

    @Test
    void testGetClientByIdNotFound() throws Exception {
        mockMvc.perform(get("/v1/clients/99999")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    void testGetClientByDocument() throws Exception {
        Client saved = clientRepository.save(testClient);

        mockMvc.perform(get("/v1/clients/document/" + testClient.getDocumentId())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Existing Client"));
    }

    @Test
    void testGetClientByDocumentNotFound() throws Exception {
        mockMvc.perform(get("/v1/clients/document/NONEXISTENT")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteClient() throws Exception {
        Client saved = clientRepository.save(testClient);

        mockMvc.perform(delete("/v1/clients/" + saved.getId())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteClientNotFound() throws Exception {
        mockMvc.perform(delete("/v1/clients/99999")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }
}
