package ec.edu.espe.zonas.repositories;
import ec.edu.espe.zonas.entidades.Espacio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface EspacioRepository extends JpaRepository<Espacio, UUID>{
    boolean existByCode(String code);

    List<Espacio> findByZona(UUID idZone);

    List<Espacio> findByZoneAndStatus(UUID idZone, boolean Status);
}