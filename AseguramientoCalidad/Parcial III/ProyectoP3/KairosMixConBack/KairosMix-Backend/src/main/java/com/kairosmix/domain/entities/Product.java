package com.kairosmix.domain.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código del producto es requerido")
    @Size(min = 2, max = 10, message = "El código debe tener entre 2 y 10 caracteres")
    @Column(unique = true, nullable = false)
    private String code;

    @NotBlank(message = "El nombre del producto es requerido")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "El país de origen es requerido")
    @Column(nullable = false)
    private String countryOfOrigin;

    @NotNull(message = "El precio por libra es requerido")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    @Column(nullable = false)
    private BigDecimal pricePerPound;

    @NotNull(message = "El precio al por mayor es requerido")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    @Column(nullable = false)
    private BigDecimal wholesalePrice;

    @NotNull(message = "El precio de venta es requerido")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    @Column(nullable = false)
    private BigDecimal retailPrice;

    @NotNull(message = "El stock inicial es requerido")
    @Min(value = 0, message = "El stock no puede ser negativo")
    @Column(nullable = false)
    private Integer initialStock;

    @Min(value = 0, message = "El stock actual no puede ser negativo")
    private Integer currentStock;

    @Lob
    private byte[] image;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /**
     * Validación: Verificar que el stock actual no sea negativo
     */
    public void validateStock() {
        if (currentStock != null && currentStock < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
    }

    /**
     * Reducir stock al crear una orden
     */
    public void reduceStock(Integer quantity) {
        if (quantity == null || quantity < 0) {
            throw new IllegalArgumentException("La cantidad debe ser positiva");
        }
        if (currentStock == null) {
            currentStock = initialStock;
        }
        if (currentStock < quantity) {
            throw new IllegalArgumentException("Stock insuficiente para este producto");
        }
        currentStock -= quantity;
    }

    /**
     * Aumentar stock al cancelar una orden
     */
    public void increaseStock(Integer quantity) {
        if (quantity == null || quantity < 0) {
            throw new IllegalArgumentException("La cantidad debe ser positiva");
        }
        if (currentStock == null) {
            currentStock = initialStock;
        }
        currentStock += quantity;
    }

    /**
     * Inicializar el stock actual al crear el producto
     */
    @PostLoad
    @PrePersist
    private void initializeStock() {
        if (currentStock == null && initialStock != null) {
            currentStock = initialStock;
        }
    }
}
