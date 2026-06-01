package ec.espe.chatsegurospring.repository;

import ec.espe.chatsegurospring.model.RoomUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomUserRepository extends JpaRepository<RoomUser, Long> {

    Optional<RoomUser> findByDeviceId(String deviceId);

    Optional<RoomUser> findByRoom_IdAndNickname(String roomId, String nickname);

    boolean existsByRoom_IdAndNickname(String roomId, String nickname);

    boolean existsByDeviceId(String deviceId);

    void deleteByRoom_IdAndNickname(String roomId, String nickname);
}
