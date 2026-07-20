package com.kairosmix.infrastructure.persistence;

import com.kairosmix.domain.entities.Order;
import com.kairosmix.domain.entities.Order.OrderStatus;
import com.kairosmix.domain.ports.output.OrderRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryAdapter implements OrderRepositoryPort {
    private final JpaOrderRepository jpaOrderRepository;

    @Override
    public Order save(Order order) {
        return jpaOrderRepository.save(order);
    }

    @Override
    public Optional<Order> findById(Long id) {
        return jpaOrderRepository.findById(id);
    }

    @Override
    public List<Order> findAll() {
        return jpaOrderRepository.findAll();
    }

    @Override
    public List<Order> findByClientId(Long clientId) {
        return jpaOrderRepository.findByClientId(clientId);
    }

    @Override
    public List<Order> findByStatus(OrderStatus status) {
        return jpaOrderRepository.findByStatus(status);
    }

    @Override
    public List<Order> findByDateRange(LocalDateTime from, LocalDateTime to) {
        return jpaOrderRepository.findByCreatedAtBetween(from, to);
    }

    @Override
    public void delete(Order order) {
        jpaOrderRepository.delete(order);
    }
}
