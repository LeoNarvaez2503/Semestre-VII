package ec.edu.espe.zonas.repositories;
import ec.edu.espe.zonas.entidades.Zona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ZonaRepository extends JpaRepository<Zona, UUID>{
    boolean existByCode (String code);
    boolean existByName (String name);
    
}


