package com.kairosmix.domain.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El cliente es requerido")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @NotNull(message = "El estado es requerido")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @NotNull(message = "El total debe especificarse")
    @DecimalMin(value = "0.00", message = "El total no puede ser negativo")
    @Column(nullable = false)
    private BigDecimal totalPrice;

    private String notes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime completedAt;

    @Version
    private Long version;

    /**
     * Transicionar el estado de la orden
     * Validar que el cambio de estado sea permitido
     */
    public void transitionTo(OrderStatus newStatus) {
        if (!canTransitionTo(newStatus)) {
            throw new IllegalStateException(
                String.format("No se puede cambiar el estado de %s a %s", status, newStatus)
            );
        }
        this.status = newStatus;
        if (newStatus == OrderStatus.COMPLETED) {
            this.completedAt = LocalDateTime.now();
        }
    }

    /**
     * Verificar si la transición de estado es válida
     */
    private boolean canTransitionTo(OrderStatus newStatus) {
        return switch (this.status) {
            case PENDING -> newStatus == OrderStatus.PROCESSING || newStatus == OrderStatus.CANCELLED;
            case PROCESSING -> newStatus == OrderStatus.WAITING || newStatus == OrderStatus.COMPLETED || newStatus == OrderStatus.CANCELLED;
            case WAITING -> newStatus == OrderStatus.PROCESSING || newStatus == OrderStatus.CANCELLED;
            case COMPLETED, CANCELLED -> false;
            case CLIENT_PENDING -> newStatus == OrderStatus.PENDING || newStatus == OrderStatus.CANCELLED;
        };
    }

    /**
     * Validar integridad de la orden
     */
    public void validateOrder() {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("La orden debe tener al menos un item");
        }
        if (totalPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El total no puede ser negativo");
        }
    }

    /**
     * Agregar item a la orden
     */
    public void addItem(OrderItem item) {
        if (item == null) {
            throw new IllegalArgumentException("El item no puede ser nulo");
        }
        item.setOrder(this);
        items.add(item);
    }

    /**
     * Calcular el total de la orden
     */
    public void calculateTotal() {
        this.totalPrice = items.stream()
            .map(OrderItem::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public enum OrderStatus {
        CLIENT_PENDING("Pendiente de Revisión"),
        PENDING("Pendiente"),
        PROCESSING("En Proceso"),
        WAITING("En Espera"),
        COMPLETED("Completado"),
        CANCELLED("Cancelado");

        private final String description;

        OrderStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
