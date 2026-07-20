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
@Table(name = "custom_mixes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomMix {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la mezcla es requerido")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    @Column(nullable = false, unique = true)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "customMix", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<MixComponent> components = new ArrayList<>();

    private String description;

    @DecimalMin(value = "0.00", message = "El total no puede ser negativo")
    private BigDecimal totalPrice;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /**
     * Agregar componente a la mezcla
     */
    public void addComponent(MixComponent component) {
        if (component == null) {
            throw new IllegalArgumentException("El componente no puede ser nulo");
        }
        component.setCustomMix(this);
        components.add(component);
    }

    /**
     * Calcular el total de la mezcla
     */
    public void calculateTotal() {
        this.totalPrice = components.stream()
            .map(MixComponent::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Validar integridad de la mezcla
     */
    public void validateMix() {
        if (components == null || components.isEmpty()) {
            throw new IllegalArgumentException("La mezcla debe tener al menos un componente");
        }
        components.forEach(MixComponent::validateComponent);
    }

    /**
     * Calcular información nutricional agregada
     */
    public MixNutritionalInfo calculateNutritionalInfo() {
        double totalCalories = 0;
        double totalProtein = 0;
        double totalFat = 0;
        double totalCarbs = 0;
        double totalFiber = 0;
        double totalQuantity = 0;

        for (MixComponent component : components) {
            totalQuantity += component.getQuantity();
        }

        for (MixComponent component : components) {
            MixNutritionalInfo info = component.getNutritionalInfo();
            if (info != null) {
                double ratio = component.getQuantity() / totalQuantity;
                totalCalories += info.getCalories() * ratio;
                totalProtein += info.getProtein() * ratio;
                totalFat += info.getFat() * ratio;
                totalCarbs += info.getCarbs() * ratio;
                totalFiber += info.getFiber() * ratio;
            }
        }

        return MixNutritionalInfo.builder()
            .calories(totalCalories)
            .protein(totalProtein)
            .fat(totalFat)
            .carbs(totalCarbs)
            .fiber(totalFiber)
            .build();
    }
}
