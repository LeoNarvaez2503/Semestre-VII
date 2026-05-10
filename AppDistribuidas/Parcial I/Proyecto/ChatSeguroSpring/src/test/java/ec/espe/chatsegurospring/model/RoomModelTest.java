package ec.espe.chatsegurospring.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collection;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Room - Modelo de sala de chat")
class RoomModelTest {

    private Room room;

    @BeforeEach
    void setUp() {
        room = new Room("test-room-123", RoomType.MULTIMEDIA, "pin-hash-123", "pin-digest-456", System.currentTimeMillis());
    }

    @Test
    @DisplayName("Crear Room con todos los parámetros")
    void testCreateRoomWithAllParameters() {
        assertThat(room)
                .isNotNull()
                .hasFieldOrPropertyWithValue("id", "test-room-123")
                .hasFieldOrPropertyWithValue("type", RoomType.MULTIMEDIA)
                .hasFieldOrPropertyWithValue("pinHash", "pin-hash-123")
                .hasFieldOrPropertyWithValue("pinDigest", "pin-digest-456");
    }

    @Test
    @DisplayName("Room getter para id")
    void testGetId() {
        assertThat(room.getId()).isEqualTo("test-room-123");
    }

    @Test
    @DisplayName("Room getter para type")
    void testGetType() {
        assertThat(room.getType()).isEqualTo(RoomType.MULTIMEDIA);
    }

    @Test
    @DisplayName("Room getter para pinHash")
    void testGetPinHash() {
        assertThat(room.getPinHash()).isEqualTo("pin-hash-123");
    }

    @Test
    @DisplayName("Room getter para pinDigest")
    void testGetPinDigest() {
        assertThat(room.getPinDigest()).isEqualTo("pin-digest-456");
    }

    @Test
    @DisplayName("Room getter para createdAt")
    void testGetCreatedAt() {
        long timestamp = System.currentTimeMillis();
        Room newRoom = new Room("room-id", RoomType.TEXTO, "hash", "digest", timestamp);
        assertThat(newRoom.getCreatedAt()).isEqualTo(timestamp);
    }

    @Test
    @DisplayName("Room con tipo TEXTO")
    void testRoomWithTypeTEXTO() {
        Room textRoom = new Room("text-room", RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());
        assertThat(textRoom.getType()).isEqualTo(RoomType.TEXTO);
    }

    @Test
    @DisplayName("Room con tipo MULTIMEDIA")
    void testRoomWithTypeMultimedia() {
        Room multimediaRoom = new Room("media-room", RoomType.MULTIMEDIA, "hash", "digest", System.currentTimeMillis());
        assertThat(multimediaRoom.getType()).isEqualTo(RoomType.MULTIMEDIA);
    }

    @Test
    @DisplayName("Room users collection debe existir")
    void testRoomUsersCollectionExists() {
        assertThat(room.getUsers())
                .isNotNull()
                .isInstanceOf(Collection.class);
    }

    @Test
    @DisplayName("Room files collection debe existir")
    void testRoomFilesCollectionExists() {
        assertThat(room.getFiles())
                .isNotNull()
                .isInstanceOf(Collection.class);
    }

    @Test
    @DisplayName("Múltiples rooms con IDs diferentes")
    void testMultipleRoomsWithDifferentIds() {
        Room room1 = new Room("room-1", RoomType.TEXTO, "hash1", "digest1", System.currentTimeMillis());
        Room room2 = new Room("room-2", RoomType.MULTIMEDIA, "hash2", "digest2", System.currentTimeMillis());

        assertThat(room1.getId()).isNotEqualTo(room2.getId());
        assertThat(room1.getType()).isNotEqualTo(room2.getType());
    }

    @Test
    @DisplayName("Room con Id único")
    void testRoomWithUniqueId() {
        String uniqueId = "unique-room-" + System.currentTimeMillis();
        Room newRoom = new Room(uniqueId, RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());
        assertThat(newRoom.getId()).isEqualTo(uniqueId);
    }

    @Test
    @DisplayName("Room con todos los tipos válidos")
    void testRoomWithAllValidTypes() {
        Room textRoom = new Room("text-room", RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());
        Room multimediaRoom = new Room("media-room", RoomType.MULTIMEDIA, "hash", "digest", System.currentTimeMillis());

        assertThat(textRoom.getType()).isIn(RoomType.values());
        assertThat(multimediaRoom.getType()).isIn(RoomType.values());
    }
}
