package com.kairosmix.application.usecases;

import com.kairosmix.domain.entities.Product;
import com.kairosmix.domain.ports.output.ProductRepositoryPort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UpdateProductUseCaseFailuresTest {
    @Mock private ProductRepositoryPort productRepository;
    @InjectMocks private UpdateProductUseCase useCase;

    @Test
    void testExecuteNotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> useCase.execute(1L, new Product()));
    }
    
    @Test
    void testExecuteCodeExists() {
        Product existing = new Product();
        existing.setId(1L);
        existing.setCode("CODE");
        
        Product input = new Product();
        input.setCode("NEWCODE");
        
        Product other = new Product();
        other.setId(2L);
        
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.findByCode("NEWCODE")).thenReturn(Optional.of(other));
        
        assertThrows(IllegalArgumentException.class, () -> useCase.execute(1L, input));
    }
}
