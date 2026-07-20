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
class UpdateProductUseCaseTest {
    @Mock private ProductRepositoryPort productRepository;
    @InjectMocks private UpdateProductUseCase useCase;

    @Test
    void testExecuteWithNull() {
        assertThrows(IllegalArgumentException.class, () -> useCase.execute(1L, null));
    }

    @Test
    void testExecuteProductNotFound() {
        Product p = new Product();
        p.setCode("123");
        when(productRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> useCase.execute(1L, p));
    }
    
    @Test
    void testExecuteValid() {
        Product existing = new Product();
        existing.setId(1L);
        existing.setCode("OLD-CODE");
        existing.setName("Old");
        
        Product update = new Product();
        update.setId(1L);
        update.setCode("NEW-CODE");
        update.setName("New");
        update.setCountryOfOrigin("CO");
        update.setPricePerPound(BigDecimal.valueOf(15.0));
        update.setWholesalePrice(BigDecimal.valueOf(12.0));
        update.setRetailPrice(BigDecimal.valueOf(18.0));
        update.setInitialStock(50);
        update.setCurrentStock(50);
        
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any())).thenReturn(update);
        
        Product updated = useCase.execute(1L, update);
        assertNotNull(updated);
        assertEquals("NEW-CODE", updated.getCode());
        verify(productRepository).save(any());
    }

    @Test
    void testExecuteNullId() {
        Product p = new Product();
        assertThrows(IllegalArgumentException.class, () -> useCase.execute(null, p));
    }
}
