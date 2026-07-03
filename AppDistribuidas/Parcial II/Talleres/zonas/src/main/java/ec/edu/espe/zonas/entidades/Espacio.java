package ec.edu.espe.zonas.entidades;

import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "espacios")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Espacio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false, length = 12)
    private String code;

    @Column(unique = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEspacio type;

    @Column(nullable = false)
    private boolean status;

    @Enumerated (EnumType.STRING)
    @Column(nullable = false)
    private EstadoEspacio estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_zona")
    @JsonIgnore
    private Zona zone;

    @Column(name = "vehiculo_id", nullable = true)
    private UUID vehiculoId;

    @Column
    private LocalDateTime dateCreated;

    @Column
    private LocalDateTime dateModified;
}
