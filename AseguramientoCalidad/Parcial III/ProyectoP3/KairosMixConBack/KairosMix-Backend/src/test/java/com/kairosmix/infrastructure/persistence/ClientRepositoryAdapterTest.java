package com.kairosmix.infrastructure.persistence;

import com.kairosmix.domain.entities.Client;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ClientRepositoryAdapterTest {

    @Autowired
    private ClientRepositoryAdapter clientRepositoryAdapter;

    private Client testClient;

    @BeforeEach
    void setUp() {
        testClient = Client.builder()
            .documentId("DOC-REPO-001")
            .documentType(Client.DocumentType.CEDULA)
            .name("Test Client")
            .email("test@client.com")
            .phone("1234567890")
            .address("Test Address 123")
            .city("Quito")
            .build();
    }

    @Test
    void testSaveClient() {
        Client saved = clientRepositoryAdapter.save(testClient);
        
        assertNotNull(saved.getId());
        assertEquals(testClient.getName(), saved.getName());
        assertEquals(testClient.getEmail(), saved.getEmail());
    }

    @Test
    void testFindClientById() {
        Client saved = clientRepositoryAdapter.save(testClient);
        Optional<Client> found = clientRepositoryAdapter.findById(saved.getId());
        
        assertTrue(found.isPresent());
        assertEquals(saved.getId(), found.get().getId());
    }

    @Test
    void testFindAllClients() {
        clientRepositoryAdapter.save(testClient);
        List<Client> all = clientRepositoryAdapter.findAll();
        
        assertFalse(all.isEmpty());
        assertTrue(all.stream().anyMatch(c -> c.getName().equals("Test Client")));
    }

    @Test
    void testDeleteClient() {
        Client saved = clientRepositoryAdapter.save(testClient);
        clientRepositoryAdapter.delete(saved);
        Optional<Client> found = clientRepositoryAdapter.findById(saved.getId());
        
        assertTrue(found.isEmpty());
    }

    @Test
    void testUpdateClient() {
        Client saved = clientRepositoryAdapter.save(testClient);
        saved.setName("Updated Client");
        Client updated = clientRepositoryAdapter.save(saved);
        
        assertEquals("Updated Client", updated.getName());
    }
}
