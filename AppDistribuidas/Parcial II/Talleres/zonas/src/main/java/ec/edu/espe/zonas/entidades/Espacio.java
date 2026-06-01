package ec.edu.espe.zonas.entidades;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name="espacios")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Espacio{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique=true, nullable=false, length=12)
    private String code;

    @Column(unique=false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEspacio type;

    @OneToMany(mappedBy = "zona")

    @Column (nullable = false)
    private boolean status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_zona")
    private Zona zone;

    @Column
    private LocalDateTime dateCreated;

    @Column
    private LocalDateTime dateModified;


}
