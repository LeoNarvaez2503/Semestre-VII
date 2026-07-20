package com.kairosmix.domain.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Client Entity Tests")
class ClientTest {

    private Client client;

    @BeforeEach
    void setUp() {
        client = Client.builder()
            .id(1L)
            .documentId("1234567890")
            .documentType(Client.DocumentType.CEDULA)
            .name("Juan Pérez")
            .email("juan@email.com")
            .phone("0998765432")
            .address("Av. Test 123")
            .city("Quito")
            .build();
    }

    @Test
    @DisplayName("Should create client successfully")
    void testCreateClient() {
        assertNotNull(client);
        assertEquals("1234567890", client.getDocumentId());
        assertEquals("Juan Pérez", client.getName());
    }

    @Test
    @DisplayName("Should validate client data successfully")
    void testValidateClientData() {
        assertDoesNotThrow(client::validateClientData);
    }

    @Test
    @DisplayName("Should throw exception when document is empty")
    void testValidateClientDataEmptyDocument() {
        client.setDocumentId("");
        assertThrows(IllegalArgumentException.class, client::validateClientData);
    }

    @Test
    @DisplayName("Should throw exception when email is invalid")
    void testValidateClientDataInvalidEmail() {
        client.setEmail("invalid-email");
        assertThrows(IllegalArgumentException.class, client::validateClientData);
    }

    @Test
    @DisplayName("Should throw exception when name is empty")
    void testValidateClientDataEmptyName() {
        client.setName("");
        assertThrows(IllegalArgumentException.class, client::validateClientData);
    }

    @Test
    @DisplayName("Should return correct document type description")
    void testDocumentTypeDescription() {
        assertEquals("Cédula de Ciudadanía", Client.DocumentType.CEDULA.getDescription());
        assertEquals("RUC", Client.DocumentType.RUC.getDescription());
        assertEquals("Pasaporte", Client.DocumentType.PASAPORTE.getDescription());
    }
}
