package com.kairosmix.domain.entities;

import jakarta.persistence.Embeddable;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MixNutritionalInfo {
    private Double calories;
    private Double protein;
    private Double fat;
    private Double carbs;
    private Double fiber;

    @Override
    public String toString() {
        return String.format(
            "Calorías: %.2f, Proteína: %.2fg, Grasas: %.2fg, Carbohidratos: %.2fg, Fibra: %.2fg",
            calories != null ? calories : 0,
            protein != null ? protein : 0,
            fat != null ? fat : 0,
            carbs != null ? carbs : 0,
            fiber != null ? fiber : 0
        );
    }
}
