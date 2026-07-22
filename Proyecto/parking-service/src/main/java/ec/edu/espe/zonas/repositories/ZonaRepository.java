package ec.edu.espe.zonas.repositories;

import ec.edu.espe.zonas.entidades.Zona;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZonaRepository extends JpaRepository<Zona, UUID> {
    boolean existsByCode(String code);
    boolean existsByName(String name);
    boolean existsByNameIgnoreCase(String name);
}
