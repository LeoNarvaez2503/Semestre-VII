package ec.edu.espe.zonas.repositories;

import ec.edu.espe.zonas.entidades.Espacio;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EspacioRepository extends JpaRepository<Espacio, UUID> {
    boolean existsByCode(String code);

    List<Espacio> findByZoneId(UUID idZone);

    List<Espacio> findByZoneIdAndStatus(UUID idZone, boolean status);
}
