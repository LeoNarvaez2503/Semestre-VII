package com.kairosmix.infrastructure.rest.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDTO {
    private Long id;

    @NotBlank(message = "El documento es requerido")
    private String documentId;

    @NotBlank(message = "El tipo de documento es requerido")
    private String documentType;

    @NotBlank(message = "El nombre es requerido")
    private String name;

    @NotBlank(message = "El email es requerido")
    @Email
    private String email;

    @NotBlank(message = "El teléfono es requerido")
    private String phone;

    @NotBlank(message = "La dirección es requerida")
    private String address;

    @NotBlank(message = "La ciudad es requerida")
    private String city;
}
