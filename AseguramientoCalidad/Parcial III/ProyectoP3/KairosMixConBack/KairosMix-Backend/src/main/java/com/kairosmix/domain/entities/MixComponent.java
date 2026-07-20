package com.kairosmix.domain.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;

@Entity
@Table(name = "mix_components")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MixComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La mezcla personalizada es requerida")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "custom_mix_id", nullable = false)
    private CustomMix customMix;

    @NotNull(message = "El producto es requerido")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull(message = "La cantidad es requerida")
    @DecimalMin(value = "0.01", message = "La cantidad debe ser mayor a 0")
    @Column(nullable = false)
    private Double quantity; // en libras

    @NotNull(message = "El precio unitario es requerido")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    @Column(nullable = false)
    private BigDecimal unitPrice;

    @Embedded
    private MixNutritionalInfo nutritionalInfo;

    /**
     * Calcular el subtotal del componente
     */
    public BigDecimal getSubtotal() {
        if (unitPrice == null || quantity == null) {
            return BigDecimal.ZERO;
        }
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    /**
     * Validar integridad del componente
     */
    public void validateComponent() {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
        }
        if (unitPrice == null || unitPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio unitario debe ser mayor a 0");
        }
        if (product == null) {
            throw new IllegalArgumentException("El producto no puede ser nulo");
        }
    }
}
