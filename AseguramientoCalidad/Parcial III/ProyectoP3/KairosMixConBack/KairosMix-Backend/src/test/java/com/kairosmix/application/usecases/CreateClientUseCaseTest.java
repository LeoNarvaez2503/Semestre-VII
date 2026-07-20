package com.kairosmix.application.usecases;

import com.kairosmix.domain.entities.Client;
import com.kairosmix.domain.ports.output.ClientRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateClientUseCaseTest {

    @Mock
    private ClientRepositoryPort clientRepository;

    @InjectMocks
    private CreateClientUseCase createClientUseCase;

    private Client validClient;

    @BeforeEach
    void setUp() {
        validClient = Client.builder()
                .documentId("1234567890")
                .documentType(Client.DocumentType.CEDULA)
                .name("John Doe")
                .email("john@example.com")
                .phone("0991234567")
                .address("123 Main St")
                .city("Quito")
                .build();
    }

    @Test
    void execute_WhenClientIsValid_ShouldReturnSavedClient() {
        when(clientRepository.findByDocumentId(anyString())).thenReturn(Optional.empty());
        when(clientRepository.save(any(Client.class))).thenReturn(validClient);

        Client saved = createClientUseCase.execute(validClient);

        assertNotNull(saved);
        assertEquals("John Doe", saved.getName());
        verify(clientRepository, times(1)).save(validClient);
    }

    @Test
    void execute_WhenClientIsNull_ShouldThrowException() {
        assertThrows(IllegalArgumentException.class, () -> createClientUseCase.execute(null));
    }

    @Test
    void execute_WhenDocumentAlreadyExists_ShouldThrowException() {
        when(clientRepository.findByDocumentId(validClient.getDocumentId())).thenReturn(Optional.of(validClient));

        assertThrows(IllegalArgumentException.class, () -> createClientUseCase.execute(validClient));
        verify(clientRepository, never()).save(any(Client.class));
    }
}
