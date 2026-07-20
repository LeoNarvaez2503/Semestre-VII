package com.kairosmix.infrastructure.rest.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Long id;

    @NotNull(message = "El producto es requerido")
    private Long productId;

    private String productCode;

    private String productName;

    @NotNull(message = "La cantidad es requerida")
    @Min(value = 1)
    private Integer quantity;

    @NotNull(message = "El precio es requerido")
    @DecimalMin(value = "0.01")
    private BigDecimal unitPrice;

    private String priceType;

    private BigDecimal subtotal;
}
