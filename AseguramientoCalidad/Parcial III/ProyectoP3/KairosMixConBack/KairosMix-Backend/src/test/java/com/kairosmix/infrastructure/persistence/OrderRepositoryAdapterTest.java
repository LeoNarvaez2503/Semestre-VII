package com.kairosmix.infrastructure.persistence;

import com.kairosmix.domain.entities.Client;
import com.kairosmix.domain.entities.Order;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class OrderRepositoryAdapterTest {

    @Autowired
    private OrderRepositoryAdapter orderRepositoryAdapter;

    @Autowired
    private ClientRepositoryAdapter clientRepositoryAdapter;

    private Order testOrder;

    @BeforeEach
    void setUp() {
        Client client = clientRepositoryAdapter.save(Client.builder()
            .documentId("DOC-ORD-REPO-01")
            .documentType(Client.DocumentType.CEDULA)
            .name("Order Test Client")
            .email("ordertest@client.com")
            .phone("1234567890")
            .address("Test Address 123")
            .city("Quito")
            .build());

        testOrder = Order.builder()
            .client(client)
            .status(Order.OrderStatus.PENDING)
            .totalPrice(BigDecimal.valueOf(100.0))
            .build();
    }

    @Test
    void testSaveOrder() {
        Order saved = orderRepositoryAdapter.save(testOrder);

        assertNotNull(saved.getId());
        assertEquals(testOrder.getStatus(), saved.getStatus());
    }

    @Test
    void testFindOrderById() {
        Order saved = orderRepositoryAdapter.save(testOrder);
        Optional<Order> found = orderRepositoryAdapter.findById(saved.getId());

        assertTrue(found.isPresent());
        assertEquals(saved.getId(), found.get().getId());
    }

    @Test
    void testFindAllOrders() {
        orderRepositoryAdapter.save(testOrder);
        List<Order> all = orderRepositoryAdapter.findAll();

        assertFalse(all.isEmpty());
    }

    @Test
    void testDeleteOrder() {
        Order saved = orderRepositoryAdapter.save(testOrder);
        orderRepositoryAdapter.delete(saved);
        Optional<Order> found = orderRepositoryAdapter.findById(saved.getId());

        assertTrue(found.isEmpty());
    }

    @Test
    void testUpdateOrderStatus() {
        Order saved = orderRepositoryAdapter.save(testOrder);
        saved.setStatus(Order.OrderStatus.PROCESSING);
        Order updated = orderRepositoryAdapter.save(saved);

        assertEquals(Order.OrderStatus.PROCESSING, updated.getStatus());
    }
}
