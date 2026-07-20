package com.kairosmix.infrastructure.mapper;

import com.kairosmix.domain.entities.Client;
import com.kairosmix.domain.entities.Order;
import com.kairosmix.infrastructure.rest.dto.OrderDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class OrderMapperTest {

    @Autowired
    private OrderMapper orderMapper;

    private Order order;
    private OrderDTO orderDTO;

    @BeforeEach
    void setUp() {
        LocalDateTime now = LocalDateTime.now();

        Client client = Client.builder()
            .id(1L)
            .documentId("1234567890")
            .documentType(Client.DocumentType.CEDULA)
            .name("Test Client")
            .email("test@client.com")
            .phone("1234567890")
            .address("Test Address 123")
            .city("Quito")
            .build();

        order = Order.builder()
            .id(1L)
            .client(client)
            .status(Order.OrderStatus.PENDING)
            .totalPrice(java.math.BigDecimal.valueOf(150.0))
            .createdAt(now)
            .build();

        orderDTO = OrderDTO.builder()
            .id(1L)
            .status("PENDING")
            .totalPrice(java.math.BigDecimal.valueOf(150.0))
            .createdAt(now.toString())
            .build();
    }

    @Test
    void testEntityToDto() {
        OrderDTO result = orderMapper.entityToDto(order);
        
        assertNotNull(result);
        assertEquals(order.getId(), result.getId());
    }

    @Test
    void testEntityToDtoWithNull() {
        OrderDTO result = orderMapper.entityToDto(null);
        assertNull(result);
    }

    @Test
    void testDtoToEntity() {
        Order result = orderMapper.dtoToEntity(orderDTO);
        
        assertNotNull(result);
        assertEquals(orderDTO.getId(), result.getId());
    }

    @Test
    void testDtoToEntityWithNull() {
        Order result = orderMapper.dtoToEntity(null);
        assertNull(result);
    }

    @Test
    void testStatusMapping() {
        order.setStatus(Order.OrderStatus.PROCESSING);
        OrderDTO dto = orderMapper.entityToDto(order);
        
        assertNotNull(dto);
    }
}
