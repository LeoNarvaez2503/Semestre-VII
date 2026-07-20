package com.kairosmix.application.usecases;

import com.kairosmix.domain.entities.Order;
import com.kairosmix.domain.entities.OrderItem;
import com.kairosmix.domain.entities.Product;
import com.kairosmix.domain.ports.output.OrderRepositoryPort;
import com.kairosmix.domain.ports.output.ProductRepositoryPort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UpdateOrderStatusUseCaseTest {
    @Mock private OrderRepositoryPort orderRepository;
    @Mock private ProductRepositoryPort productRepository;
    @InjectMocks private UpdateOrderStatusUseCase useCase;

    @Test
    void testExecute() {
        assertThrows(IllegalArgumentException.class, () -> useCase.execute(1L, null));
    }
    
    @Test
    void testExecuteValid() {
        Order order = new Order();
        order.setStatus(Order.OrderStatus.PENDING);
        
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenReturn(order);
        
        Order updated = useCase.execute(1L, Order.OrderStatus.PROCESSING);
        assertNotNull(updated);
        assertEquals(Order.OrderStatus.PROCESSING, updated.getStatus());
        verify(orderRepository).save(any());
    }

    @Test
    void testCancelOrderReturnsStock() {
        Product product = new Product();
        product.setId(10L);
        product.setInitialStock(5);
        product.setCurrentStock(5);
        product.setCode("P1");
        product.setName("Prod");
        product.setCountryOfOrigin("EC");
        product.setPricePerPound(BigDecimal.ONE);
        product.setWholesalePrice(BigDecimal.ONE);
        product.setRetailPrice(BigDecimal.ONE);

        OrderItem item = new OrderItem();
        item.setProduct(product);
        item.setQuantity(2);
        item.setUnitPrice(BigDecimal.ONE);

        Order order = new Order();
        order.setStatus(Order.OrderStatus.PROCESSING);
        order.addItem(item);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(productRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Order updated = useCase.execute(1L, Order.OrderStatus.CANCELLED);

        assertEquals(Order.OrderStatus.CANCELLED, updated.getStatus());
        assertEquals(7, product.getCurrentStock());
        verify(productRepository).save(any(Product.class));
        verify(orderRepository).save(any(Order.class));
    }
}
