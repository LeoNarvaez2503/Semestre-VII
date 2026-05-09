package ec.espe.chatsegurospring.repository;

import ec.espe.chatsegurospring.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {

    /**
     * Returns all rooms matching the SHA-256 digest of the PIN.
     * Since multiple rooms may share the same PIN, this returns a List.
     * BCrypt verification is done in the service layer.
     */
    List<Room> findAllByPinDigest(String pinDigest);
}
