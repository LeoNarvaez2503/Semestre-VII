package ec.espe.chatsegurospring.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

@DisplayName("SharedFile - Modelo de archivo compartido")
class SharedFileTest {

    private SharedFile sharedFile;
    private Room room;

    @BeforeEach
    void setUp() {
        room = new Room("room-123", RoomType.MULTIMEDIA, "hash", "digest", System.currentTimeMillis());
    }

    @Test
    @DisplayName("Crear SharedFile con todos los parámetros")
    void testCreateSharedFileWithAllParameters() {
        sharedFile = new SharedFile("documento.pdf", "/uploads/doc.pdf", "application/pdf", 1024000, "user@example.com", System.currentTimeMillis(), room);

        assertThat(sharedFile)
                .isNotNull()
                .hasFieldOrPropertyWithValue("originalName", "documento.pdf")
                .hasFieldOrPropertyWithValue("url", "/uploads/doc.pdf")
                .hasFieldOrPropertyWithValue("contentType", "application/pdf")
                .hasFieldOrPropertyWithValue("size", 1024000L)
                .hasFieldOrPropertyWithValue("sender", "user@example.com")
                .hasFieldOrPropertyWithValue("room", room);
    }

    @Test
    @DisplayName("SharedFile getter para originalName")
    void testGetOriginalName() {
        sharedFile = new SharedFile("test.txt", "/uploads/test.txt", "text/plain", 512, "sender", System.currentTimeMillis(), room);
        assertThat(sharedFile.getOriginalName()).isEqualTo("test.txt");
    }

    @Test
    @DisplayName("SharedFile getter para url")
    void testGetUrl() {
        sharedFile = new SharedFile("test.txt", "/uploads/test.txt", "text/plain", 512, "sender", System.currentTimeMillis(), room);
        assertThat(sharedFile.getUrl()).isEqualTo("/uploads/test.txt");
    }

    @Test
    @DisplayName("SharedFile getter para contentType")
    void testGetContentType() {
        sharedFile = new SharedFile("test.txt", "/uploads/test.txt", "text/plain", 512, "sender", System.currentTimeMillis(), room);
        assertThat(sharedFile.getContentType()).isEqualTo("text/plain");
    }

    @Test
    @DisplayName("SharedFile getter para size")
    void testGetSize() {
        sharedFile = new SharedFile("test.txt", "/uploads/test.txt", "text/plain", 2048, "sender", System.currentTimeMillis(), room);
        assertThat(sharedFile.getSize()).isEqualTo(2048L);
    }

    @Test
    @DisplayName("SharedFile getter para sender")
    void testGetSender() {
        sharedFile = new SharedFile("test.txt", "/uploads/test.txt", "text/plain", 512, "admin@test.com", System.currentTimeMillis(), room);
        assertThat(sharedFile.getSender()).isEqualTo("admin@test.com");
    }

    @Test
    @DisplayName("SharedFile getter para uploadedAt")
    void testGetUploadedAt() {
        long timestamp = System.currentTimeMillis();
        sharedFile = new SharedFile("test.txt", "/uploads/test.txt", "text/plain", 512, "sender", timestamp, room);
        assertThat(sharedFile.getUploadedAt()).isEqualTo(timestamp);
    }

    @Test
    @DisplayName("SharedFile getter para room")
    void testGetRoom() {
        sharedFile = new SharedFile("test.txt", "/uploads/test.txt", "text/plain", 512, "sender", System.currentTimeMillis(), room);
        assertThat(sharedFile.getRoom()).isEqualTo(room);
    }

    @Test
    @DisplayName("SharedFile getter para id (null para nuevo registro)")
    void testGetIdIsNull() {
        sharedFile = new SharedFile("test.txt", "/uploads/test.txt", "text/plain", 512, "sender", System.currentTimeMillis(), room);
        assertThat(sharedFile.getId()).isNull();
    }

    @Test
    @DisplayName("Múltiples archivos en la misma sala")
    void testMultipleFilesInSameRoom() {
        SharedFile file1 = new SharedFile("doc1.pdf", "/uploads/doc1.pdf", "application/pdf", 1024, "user1", System.currentTimeMillis(), room);
        SharedFile file2 = new SharedFile("doc2.txt", "/uploads/doc2.txt", "text/plain", 512, "user2", System.currentTimeMillis(), room);

        assertThat(file1.getRoom()).isEqualTo(file2.getRoom());
        assertThat(file1.getSender()).isNotEqualTo(file2.getSender());
    }
}
