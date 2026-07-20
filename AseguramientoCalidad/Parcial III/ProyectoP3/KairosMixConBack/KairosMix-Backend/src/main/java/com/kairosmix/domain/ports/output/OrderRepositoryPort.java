package com.kairosmix.domain.ports.output;

import com.kairosmix.domain.entities.Order;
import com.kairosmix.domain.entities.Order.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepositoryPort {
    Order save(Order order);
    Optional<Order> findById(Long id);
    List<Order> findAll();
    List<Order> findByClientId(Long clientId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByDateRange(LocalDateTime from, LocalDateTime to);
    void delete(Order order);
}
