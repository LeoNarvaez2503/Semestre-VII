package ec.edu.espe.zonas.entidades;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name="zonas")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Zona{
    @Id
    @GeneratedValue(Strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false, length = 100)
    private String nombre;

    @Column(unique=true, nullable=false, length = 3)
    private String codigo;

    @Column
    private String descripcion;

    @Column
    private String description;
}

