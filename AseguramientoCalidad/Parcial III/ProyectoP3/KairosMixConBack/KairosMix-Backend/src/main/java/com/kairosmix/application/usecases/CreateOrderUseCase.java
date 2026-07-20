package com.kairosmix.application.usecases;

import com.kairosmix.domain.entities.Client;
import com.kairosmix.domain.entities.Order;
import com.kairosmix.domain.entities.OrderItem;
import com.kairosmix.domain.entities.Product;
import com.kairosmix.domain.ports.output.ClientRepositoryPort;
import com.kairosmix.domain.ports.output.OrderRepositoryPort;
import com.kairosmix.domain.ports.output.ProductRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CreateOrderUseCase {
    private final OrderRepositoryPort orderRepository;
    private final ProductRepositoryPort productRepository;
    private final ClientRepositoryPort clientRepository;

    public Order execute(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("La orden no puede ser nula");
        }

        // Validar que tenga items
        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new IllegalArgumentException("La orden debe tener al menos un item");
        }

        log.info("CreateOrder: Order items count = {}", order.getItems().size());

        if (order.getClient() == null || order.getClient().getId() == null) {
            throw new IllegalArgumentException("El cliente de la orden es requerido");
        }

        // Recuperar el cliente desde la BD para evitar detached entity problem
        log.info("Loading client with id={}", order.getClient().getId());
        Client client = clientRepository.findById(order.getClient().getId())
            .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado: " + order.getClient().getId()));
        order.setClient(client);
        log.info("Client loaded: {}", client.getName());

        // Establecer la relación bidireccional: cada item debe conocer su orden
        log.info("Setting order relationship for items");
        order.getItems().forEach(item -> item.setOrder(order));
        log.info("Order relationship set");

        // Validar y procesar items
        for (OrderItem item : order.getItems()) {
            if (item.getProduct() == null || item.getProduct().getId() == null) {
                throw new IllegalArgumentException("Cada item debe tener un producto válido");
            }

            log.info("  Validating item: productId={}, quantity={}, unitPrice={}", 
                item.getProduct() != null ? item.getProduct().getId() : null,
                item.getQuantity(),
                item.getUnitPrice());
            
            item.validateItem();
            log.info("  Item validated");

            log.info("  Finding product with id={}", item.getProduct().getId());
            Product product = productRepository.findById(item.getProduct().getId())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + item.getProduct().getId()));
            log.info("  Product found: {}", product.getName());

            // Verificar stock disponible
            if (product.getCurrentStock() < item.getQuantity()) {
                throw new IllegalArgumentException(
                    String.format("Stock insuficiente para %s. Disponible: %d, Solicitado: %d",
                        product.getName(), product.getCurrentStock(), item.getQuantity())
                );
            }

            // Reducir stock
            log.info("  Reducing stock");
            product.reduceStock(item.getQuantity());
            productRepository.save(product);
            log.info("  Stock reduced");
        }

        log.info("All items processed. Calculating total");
        // Calcular total
        order.calculateTotal();
        log.info("Total calculated: {}", order.getTotalPrice());

        // Validar orden
        log.info("Validating order");
        order.validateOrder();
        log.info("Order validated");

        log.info("Saving order to repository");
        Order saved = orderRepository.save(order);
        log.info("Order saved with id={}", saved.getId());

        return saved;
    }
}
