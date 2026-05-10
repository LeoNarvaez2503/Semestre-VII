package ec.espe.chatsegurospring.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

@DisplayName("RoomUser - Modelo de usuario en sala")
class RoomUserModelTest {

    private RoomUser roomUser;
    private Room room;

    @BeforeEach
    void setUp() {
        room = new Room("room-123", RoomType.MULTIMEDIA, "hash", "digest", System.currentTimeMillis());
    }

    @Test
    @DisplayName("Crear RoomUser con todos los parámetros")
    void testCreateRoomUserWithAllParameters() {
        long joinedAt = System.currentTimeMillis();
        roomUser = new RoomUser("alice", "device-abc123", joinedAt, room);

        assertThat(roomUser)
                .isNotNull()
                .hasFieldOrPropertyWithValue("nickname", "alice")
                .hasFieldOrPropertyWithValue("deviceId", "device-abc123")
                .hasFieldOrPropertyWithValue("joinedAt", joinedAt)
                .hasFieldOrPropertyWithValue("room", room);
    }

    @Test
    @DisplayName("RoomUser getter para nickname")
    void testGetNickname() {
        roomUser = new RoomUser("bob", "device-xyz", System.currentTimeMillis(), room);
        assertThat(roomUser.getNickname()).isEqualTo("bob");
    }

    @Test
    @DisplayName("RoomUser getter para deviceId")
    void testGetDeviceId() {
        roomUser = new RoomUser("charlie", "device-789", System.currentTimeMillis(), room);
        assertThat(roomUser.getDeviceId()).isEqualTo("device-789");
    }

    @Test
    @DisplayName("RoomUser getter para room")
    void testGetRoom() {
        roomUser = new RoomUser("david", "device-456", System.currentTimeMillis(), room);
        assertThat(roomUser.getRoom()).isEqualTo(room);
    }

    @Test
    @DisplayName("RoomUser getter para id (null para nuevo registro)")
    void testGetIdIsNull() {
        roomUser = new RoomUser("eve", "device-111", System.currentTimeMillis(), room);
        assertThat(roomUser.getId()).isNull();
    }

    @Test
    @DisplayName("RoomUser getter para joinedAt")
    void testGetJoinedAt() {
        long joinedAt = System.currentTimeMillis();
        roomUser = new RoomUser("frank", "device-222", joinedAt, room);
        assertThat(roomUser.getJoinedAt()).isEqualTo(joinedAt);
    }

    @Test
    @DisplayName("RoomUser con nicknames diferentes")
    void testMultipleRoomUsersWithDifferentNicknames() {
        RoomUser user1 = new RoomUser("alice", "device-1", System.currentTimeMillis(), room);
        RoomUser user2 = new RoomUser("bob", "device-2", System.currentTimeMillis(), room);

        assertThat(user1.getNickname()).isNotEqualTo(user2.getNickname());
        assertThat(user1.getRoom()).isEqualTo(user2.getRoom());
    }

    @Test
    @DisplayName("RoomUser con deviceIds únicos")
    void testMultipleRoomUsersWithUniqueDeviceIds() {
        RoomUser user1 = new RoomUser("alice", "device-unique-1", System.currentTimeMillis(), room);
        RoomUser user2 = new RoomUser("alice", "device-unique-2", System.currentTimeMillis(), room);

        assertThat(user1.getDeviceId()).isNotEqualTo(user2.getDeviceId());
        assertThat(user1.getNickname()).isEqualTo(user2.getNickname());
    }

    @Test
    @DisplayName("RoomUser con características completas")
    void testRoomUserCompleteCharacteristics() {
        String nickname = "test-user";
        String deviceId = "device-test-123";
        long joinedAt = System.currentTimeMillis();
        RoomUser user = new RoomUser(nickname, deviceId, joinedAt, room);

        assertThat(user)
                .hasFieldOrPropertyWithValue("nickname", nickname)
                .hasFieldOrPropertyWithValue("deviceId", deviceId)
                .hasFieldOrPropertyWithValue("joinedAt", joinedAt)
                .hasFieldOrPropertyWithValue("room", room);
    }
}
