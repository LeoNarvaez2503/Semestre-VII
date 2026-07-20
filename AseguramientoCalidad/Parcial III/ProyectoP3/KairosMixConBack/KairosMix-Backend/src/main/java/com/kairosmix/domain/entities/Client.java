package com.kairosmix.domain.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "clients", uniqueConstraints = {
    @UniqueConstraint(columnNames = "documentId", name = "uk_client_document_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El número de documento es requerido")
    @Column(nullable = false, unique = true)
    private String documentId;

    @NotNull(message = "El tipo de documento es requerido")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType documentType;

    @NotBlank(message = "El nombre del cliente es requerido")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe ser válido")
    @Column(nullable = false)
    private String email;

    @NotBlank(message = "El teléfono es requerido")
    @Pattern(regexp = "^[0-9\\-\\+\\(\\)\\s]{7,}$", message = "El teléfono debe ser válido")
    private String phone;

    @NotBlank(message = "La dirección es requerida")
    @Size(min = 5, max = 200, message = "La dirección debe tener entre 5 y 200 caracteres")
    private String address;

    @NotBlank(message = "La ciudad es requerida")
    private String city;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime registrationDate;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    /**
     * Validar integridad del cliente
     */
    public void validateClientData() {
        if (documentId == null || documentId.isEmpty()) {
            throw new IllegalArgumentException("El documento no puede estar vacío");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("El email debe ser válido");
        }
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío");
        }
    }

    public enum DocumentType {
        CEDULA("Cédula de Ciudadanía"),
        RUC("RUC"),
        PASAPORTE("Pasaporte");

        private final String description;

        DocumentType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
