package com.kairosmix.infrastructure.rest.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;

    @NotBlank(message = "El código es requerido")
    private String code;

    @NotBlank(message = "El nombre es requerido")
    private String name;

    @NotBlank(message = "El país de origen es requerido")
    private String countryOfOrigin;

    @NotNull(message = "El precio por libra es requerido")
    @DecimalMin(value = "0.01")
    private BigDecimal pricePerPound;

    @NotNull(message = "El precio al por mayor es requerido")
    @DecimalMin(value = "0.01")
    private BigDecimal wholesalePrice;

    @NotNull(message = "El precio de venta es requerido")
    @DecimalMin(value = "0.01")
    private BigDecimal retailPrice;

    @NotNull(message = "El stock inicial es requerido")
    @Min(value = 0)
    private Integer initialStock;

    private Integer currentStock;

    private String imageBase64;
}
