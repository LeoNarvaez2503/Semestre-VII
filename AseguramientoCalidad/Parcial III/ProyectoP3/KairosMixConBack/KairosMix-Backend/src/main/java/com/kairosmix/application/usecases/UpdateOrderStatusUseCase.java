package com.kairosmix.application.usecases;

import com.kairosmix.domain.entities.Order;
import com.kairosmix.domain.entities.Order.OrderStatus;
import com.kairosmix.domain.entities.Product;
import com.kairosmix.domain.ports.output.OrderRepositoryPort;
import com.kairosmix.domain.ports.output.ProductRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UpdateOrderStatusUseCase {
    private final OrderRepositoryPort orderRepository;
    private final ProductRepositoryPort productRepository;

    public Order execute(Long orderId, OrderStatus newStatus) {
        if (orderId == null) {
            throw new IllegalArgumentException("El ID de la orden es requerido");
        }

        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada: " + orderId));

        // Si la orden se cancela, devolver el stock
        if (newStatus == OrderStatus.CANCELLED && order.getStatus() != OrderStatus.CANCELLED) {
            for (var item : order.getItems()) {
                Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado al cancelar"));
                product.increaseStock(item.getQuantity());
                productRepository.save(product);
            }
        }

        // Realizar la transición de estado
        order.transitionTo(newStatus);

        return orderRepository.save(order);
    }
}
