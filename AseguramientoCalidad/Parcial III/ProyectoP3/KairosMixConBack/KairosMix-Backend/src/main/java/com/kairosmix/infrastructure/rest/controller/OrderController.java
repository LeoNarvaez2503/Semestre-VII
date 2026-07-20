package com.kairosmix.infrastructure.rest.controller;

import com.kairosmix.application.usecases.CreateOrderUseCase;
import com.kairosmix.application.usecases.UpdateOrderStatusUseCase;
import com.kairosmix.domain.entities.Order;
import com.kairosmix.domain.entities.Order.OrderStatus;
import com.kairosmix.domain.ports.output.OrderRepositoryPort;
import com.kairosmix.infrastructure.rest.dto.OrderDTO;
import com.kairosmix.infrastructure.mapper.OrderMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class OrderController {
    private final CreateOrderUseCase createOrderUseCase;
    private final UpdateOrderStatusUseCase updateOrderStatusUseCase;
    private final OrderRepositoryPort orderRepository;
    private final OrderMapper orderMapper;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        try {
            log.info("=== ORDER CREATE REQUEST ===");
            log.info("DTO: {}", orderDTO);
            if (orderDTO.getItems() != null) {
                orderDTO.getItems().forEach(item -> 
                    log.info("  Item: productId={}, quantity={}, unitPrice={}", 
                        item.getProductId(), item.getQuantity(), item.getUnitPrice())
                );
            }
            Order order = orderMapper.dtoToEntity(orderDTO);
            Order created = createOrderUseCase.execute(order);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderMapper.entityToDto(created));
        } catch (Exception e) {
            log.error("ERROR en createOrder:", e);
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> listOrders() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders.stream()
            .map(orderMapper::entityToDto)
            .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada: " + id));
        return ResponseEntity.ok(orderMapper.entityToDto(order));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByClient(@PathVariable Long clientId) {
        List<Order> orders = orderRepository.findByClientId(clientId);
        return ResponseEntity.ok(orders.stream()
            .map(orderMapper::entityToDto)
            .toList());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable String status) {
        OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
        List<Order> orders = orderRepository.findByStatus(orderStatus);
        return ResponseEntity.ok(orders.stream()
            .map(orderMapper::entityToDto)
            .toList());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
        @PathVariable Long id,
        @RequestParam String status) {
        OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
        Order updated = updateOrderStatusUseCase.execute(id, newStatus);
        return ResponseEntity.ok(orderMapper.entityToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada: " + id));
        orderRepository.delete(order);
        return ResponseEntity.noContent().build();
    }
}
