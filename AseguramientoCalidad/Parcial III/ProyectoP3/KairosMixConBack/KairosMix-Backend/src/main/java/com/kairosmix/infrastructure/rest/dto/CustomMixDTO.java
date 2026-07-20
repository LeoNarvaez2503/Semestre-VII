package com.kairosmix.infrastructure.rest.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomMixDTO {
    private Long id;

    private String name;

    private Long clientId;

    private String description;

    private List<MixComponentDTO> components;

    private Double totalPrice;

    private MixNutritionalInfoDTO nutritionalInfo;
}
