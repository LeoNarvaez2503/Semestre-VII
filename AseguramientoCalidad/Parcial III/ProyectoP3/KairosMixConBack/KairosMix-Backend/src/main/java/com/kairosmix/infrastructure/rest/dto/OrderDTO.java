package com.kairosmix.infrastructure.rest.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;

    @NotNull(message = "El cliente es requerido")
    private Long clientId;

    private String clientName;

    @NotBlank(message = "El estado es requerido")
    private String status;

    @NotEmpty(message = "Debe incluir al menos un item")
    private List<OrderItemDTO> items;

    private BigDecimal totalPrice;

    private String notes;

    private String createdAt;

    private String completedAt;

    private String message;

    private Long version;
}
