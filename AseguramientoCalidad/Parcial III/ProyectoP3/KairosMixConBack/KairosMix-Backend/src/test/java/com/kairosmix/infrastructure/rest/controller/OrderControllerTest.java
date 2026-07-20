package com.kairosmix.infrastructure.rest.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kairosmix.domain.entities.Client;
import com.kairosmix.domain.entities.Order;
import com.kairosmix.domain.ports.output.ClientRepositoryPort;
import com.kairosmix.domain.ports.output.OrderRepositoryPort;
import com.kairosmix.infrastructure.rest.dto.OrderDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OrderRepositoryPort orderRepository;

    @Autowired
    private ClientRepositoryPort clientRepository;

    private Order testOrder;

    @BeforeEach
    void setUp() {
        Client client = clientRepository.save(Client.builder()
            .documentId("DOC-ORD-CTRL-01")
            .documentType(Client.DocumentType.CEDULA)
            .name("Order Ctrl Client")
            .email("orderclient@test.com")
            .phone("1234567890")
            .address("Order Street 123")
            .city("Quito")
            .build());

        testOrder = Order.builder()
            .client(client)
            .status(Order.OrderStatus.PENDING)
            .totalPrice(BigDecimal.valueOf(250.0))
            .build();
    }

    @Test
    void testListOrders() throws Exception {
        mockMvc.perform(get("/v1/orders")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void testGetOrderById() throws Exception {
        Order saved = orderRepository.save(testOrder);

        mockMvc.perform(get("/v1/orders/" + saved.getId())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void testGetOrderByIdNotFound() throws Exception {
        mockMvc.perform(get("/v1/orders/99999")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    void testGetOrdersByClient() throws Exception {
        Order saved = orderRepository.save(testOrder);
        
        mockMvc.perform(get("/v1/orders/client/" + testOrder.getClient().getId())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void testGetOrdersByStatus() throws Exception {
        orderRepository.save(testOrder);
        
        mockMvc.perform(get("/v1/orders/status/PENDING")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void testGetOrdersByStatusInvalid() throws Exception {
        mockMvc.perform(get("/v1/orders/status/INVALID_STATUS")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateOrderStatus() throws Exception {
        Order saved = orderRepository.save(testOrder);

        mockMvc.perform(patch("/v1/orders/" + saved.getId() + "/status")
            .contentType(MediaType.APPLICATION_JSON)
            .param("status", "PROCESSING"))
            .andExpect(status().isOk());
    }

    @Test
    void testUpdateOrderStatusNotFound() throws Exception {
        mockMvc.perform(patch("/v1/orders/99999/status")
            .contentType(MediaType.APPLICATION_JSON)
            .param("status", "PROCESSING"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateOrderStatusInvalid() throws Exception {
        Order saved = orderRepository.save(testOrder);

        mockMvc.perform(patch("/v1/orders/" + saved.getId() + "/status")
            .contentType(MediaType.APPLICATION_JSON)
            .param("status", "INVALID"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteOrder() throws Exception {
        Order saved = orderRepository.save(testOrder);

        mockMvc.perform(delete("/v1/orders/" + saved.getId())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteOrderNotFound() throws Exception {
        mockMvc.perform(delete("/v1/orders/99999")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }
}
