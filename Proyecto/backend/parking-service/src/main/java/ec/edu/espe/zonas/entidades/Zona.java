package ec.edu.espe.zonas.entidades;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "zonas")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Zona {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id; // claves primarias se manejaran con UUID

    @Column(unique = true, nullable = false, length = 32)
    private String name;

    @Column(unique = true, nullable = false, length = 4)
    private String code;

    @Column
    private String description;

    @Column
    private int status; // 1: Activo, 0: Inactivo

    @Column
    private int capacidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoZona type;

    @OneToMany(
        mappedBy = "zone",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Espacio> spaces;

    @Column
    private LocalDateTime dateCreated;

    @Column
    private LocalDateTime dateModified;
}
