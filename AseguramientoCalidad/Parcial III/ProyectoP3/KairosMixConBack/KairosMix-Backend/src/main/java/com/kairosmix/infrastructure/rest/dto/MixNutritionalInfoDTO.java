package com.kairosmix.infrastructure.rest.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MixNutritionalInfoDTO {
    private Double calories;
    private Double protein;
    private Double fat;
    private Double carbs;
    private Double fiber;
}
