package com.kairosmix.application.usecases;

import com.kairosmix.domain.entities.Order;
import com.kairosmix.domain.entities.Client;
import com.kairosmix.domain.ports.output.OrderRepositoryPort;
import com.kairosmix.domain.ports.output.ClientRepositoryPort;
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
class CreateOrderUseCaseTest {
    @Mock private OrderRepositoryPort orderRepository;
    @Mock private ProductRepositoryPort productRepository;
    @Mock private ClientRepositoryPort clientRepository;
    @InjectMocks private CreateOrderUseCase useCase;

    @Test
    void testExecuteWithNullOrder() {
        assertThrows(IllegalArgumentException.class, () -> useCase.execute(null));
    }
    
    @Test
    void testExecuteValid() {
        Order order = new Order();
        Client client = new Client();
        client.setId(1L);
        order.setClient(client);
        order.setStatus(Order.OrderStatus.PENDING);
        com.kairosmix.domain.entities.OrderItem item = new com.kairosmix.domain.entities.OrderItem();
        item.setQuantity(1);
        item.setUnitPrice(BigDecimal.ONE);
        com.kairosmix.domain.entities.Product product = new com.kairosmix.domain.entities.Product();
        product.setId(1L);
        product.setCurrentStock(10);
        item.setProduct(product);
        order.addItem(item);
        
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any())).thenReturn(order);
        
        Order saved = useCase.execute(order);
        assertNotNull(saved);
        verify(orderRepository).save(any());
    }
}
