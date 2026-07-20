package com.kairosmix.infrastructure.mapper;

import com.kairosmix.domain.entities.Client;
import com.kairosmix.infrastructure.rest.dto.ClientDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ClientMapperTest {

    @Autowired
    private ClientMapper clientMapper;

    private Client client;
    private ClientDTO clientDTO;

    @BeforeEach
    void setUp() {
        client = Client.builder()
            .id(1L)
            .documentId("1234567890")
            .documentType(Client.DocumentType.CEDULA)
            .name("Empresa XYZ")
            .email("contacto@empresa.com")
            .phone("1234567890")
            .address("Calle Principal 123")
            .city("Quito")
            .build();

        clientDTO = ClientDTO.builder()
            .id(1L)
            .documentId("1234567890")
            .documentType("CEDULA")
            .name("Empresa XYZ")
            .email("contacto@empresa.com")
            .phone("1234567890")
            .address("Calle Principal 123")
            .city("Quito")
            .build();
    }

    @Test
    void testEntityToDto() {
        ClientDTO result = clientMapper.entityToDto(client);
        
        assertNotNull(result);
        assertEquals(client.getId(), result.getId());
        assertEquals(client.getName(), result.getName());
        assertEquals(client.getEmail(), result.getEmail());
        assertEquals(client.getPhone(), result.getPhone());
    }

    @Test
    void testEntityToDtoWithNull() {
        ClientDTO result = clientMapper.entityToDto(null);
        assertNull(result);
    }

    @Test
    void testDtoToEntity() {
        Client result = clientMapper.dtoToEntity(clientDTO);
        
        assertNotNull(result);
        assertEquals(clientDTO.getId(), result.getId());
        assertEquals(clientDTO.getName(), result.getName());
        assertEquals(clientDTO.getEmail(), result.getEmail());
    }

    @Test
    void testDtoToEntityWithNull() {
        Client result = clientMapper.dtoToEntity(null);
        assertNull(result);
    }

    @Test
    void testMapperBidirectional() {
        ClientDTO dto = clientMapper.entityToDto(client);
        Client entityAgain = clientMapper.dtoToEntity(dto);
        
        assertEquals(client.getName(), entityAgain.getName());
        assertEquals(client.getEmail(), entityAgain.getEmail());
        assertEquals(client.getPhone(), entityAgain.getPhone());
    }
}
