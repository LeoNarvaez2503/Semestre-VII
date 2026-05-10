package ec.espe.chatsegurospring.controller;

import ec.espe.chatsegurospring.BaseTest;
import ec.espe.chatsegurospring.dto.JoinRoomRequestDTO;
import ec.espe.chatsegurospring.dto.RoomCreateRequestDTO;
import ec.espe.chatsegurospring.model.Room;
import ec.espe.chatsegurospring.model.RoomType;
import ec.espe.chatsegurospring.model.RoomUser;
import ec.espe.chatsegurospring.service.RoomService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@DisplayName("RoomController - Pruebas Unitarias")
class RoomControllerTest extends BaseTest {

    @Mock
    private RoomService roomService;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private RoomController roomController;

    // ─────────────────────────────────────────────────────────────
    // TESTS: POST /api/rooms/create
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Crear sala: PIN válido y tipo TEXTO")
    void testCreateRoom_ValidPINandTypeTEXTO() {
        RoomCreateRequestDTO payload = new RoomCreateRequestDTO();
        payload.setPin("1234");
        payload.setType("TEXTO");

        Room createdRoom = new Room("room-id-1", RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());
        when(roomService.createRoom("1234", RoomType.TEXTO)).thenReturn(createdRoom);

        ResponseEntity<?> result = roomController.createRoom(payload);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody())
                .isInstanceOf(Map.class)
                .extracting("roomId")
                .isEqualTo("room-id-1");
        assertThat(result.getBody())
                .extracting("type")
                .isEqualTo(RoomType.TEXTO);

        verify(roomService, times(1)).createRoom("1234", RoomType.TEXTO);
    }

    @Test
    @DisplayName("Crear sala: PIN válido y tipo MULTIMEDIA")
    void testCreateRoom_ValidPINandTypeMultimedia() {
        RoomCreateRequestDTO payload = new RoomCreateRequestDTO();
        payload.setPin("5678");
        payload.setType("MULTIMEDIA");

        Room createdRoom = new Room("room-id-2", RoomType.MULTIMEDIA, "hash", "digest", System.currentTimeMillis());
        when(roomService.createRoom("5678", RoomType.MULTIMEDIA)).thenReturn(createdRoom);

        ResponseEntity<?> result = roomController.createRoom(payload);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody())
                .extracting("type")
                .isEqualTo(RoomType.MULTIMEDIA);
    }

    @Test
    @DisplayName("Crear sala: tipo inválido retorna 400")
    void testCreateRoom_InvalidType() {
        RoomCreateRequestDTO payload = new RoomCreateRequestDTO();
        payload.setPin("1234");
        payload.setType("INVALID_TYPE");

        ResponseEntity<?> result = roomController.createRoom(payload);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(result.getBody())
                .isInstanceOf(Map.class)
                .extracting("error")
                .isEqualTo("Tipo de sala inválido");
    }

    @Test
    @DisplayName("Crear sala: PIN inválido lanza exception")
    void testCreateRoom_InvalidPIN() {
        RoomCreateRequestDTO payload = new RoomCreateRequestDTO();
        payload.setPin("123");
        payload.setType("TEXTO");

        when(roomService.createRoom("123", RoomType.TEXTO))
                .thenThrow(new IllegalArgumentException("El PIN debe tener 4 dígitos"));

        ResponseEntity<?> result = roomController.createRoom(payload);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(result.getBody())
                .extracting("error")
                .isEqualTo("El PIN debe tener 4 dígitos");
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: POST /api/rooms/join
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Unirse a sala: PIN válido, nuevo usuario")
    void testJoinRoom_ValidPINNewUser() {
        JoinRoomRequestDTO payload = new JoinRoomRequestDTO();
        payload.setPin("1234");
        payload.setNickname("Juan");
        payload.setDeviceId("device-uuid-123");

        Room room = new Room("room-1", RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());
        RoomUser roomUser = new RoomUser("Juan", "device-uuid-123", System.currentTimeMillis(), room);

        when(roomService.findRoomByPin("1234")).thenReturn(Optional.of(room));
        when(roomService.joinRoom("room-1", "Juan", "device-uuid-123")).thenReturn(roomUser);

        ResponseEntity<?> result = roomController.joinRoom(payload, response);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody())
                .isInstanceOf(Map.class)
                .extracting("roomId")
                .isEqualTo("room-1");
        assertThat(result.getBody())
                .extracting("nickname")
                .isEqualTo("Juan");

        verify(roomService, times(1)).findRoomByPin("1234");
        verify(roomService, times(1)).joinRoom("room-1", "Juan", "device-uuid-123");
    }

    @Test
    @DisplayName("Unirse a sala: PIN no encontrado retorna 404")
    void testJoinRoom_PINNotFound() {
        JoinRoomRequestDTO payload = new JoinRoomRequestDTO();
        payload.setPin("9999");
        payload.setNickname("Juan");
        payload.setDeviceId("device-uuid-123");

        when(roomService.findRoomByPin("9999")).thenReturn(Optional.empty());

        ResponseEntity<?> result = roomController.joinRoom(payload, response);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(result.getBody())
                .extracting("error")
                .isEqualTo("Sala no encontrada");
    }

    @Test
    @DisplayName("Unirse a sala: nickname duplicado retorna 400")
    void testJoinRoom_DuplicateNickname() {
        JoinRoomRequestDTO payload = new JoinRoomRequestDTO();
        payload.setPin("1234");
        payload.setNickname("Juan");
        payload.setDeviceId("device-uuid-123");

        Room room = new Room("room-1", RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());

        when(roomService.findRoomByPin("1234")).thenReturn(Optional.of(room));
        when(roomService.joinRoom("room-1", "Juan", "device-uuid-123"))
                .thenThrow(new IllegalStateException("Nickname ya existente en la sala"));

        ResponseEntity<?> result = roomController.joinRoom(payload, response);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(result.getBody())
                .extracting("error")
                .isEqualTo("Nickname ya existente en la sala");
    }

    @Test
    @DisplayName("Unirse a sala: deviceId nulo se auto-genera")
    void testJoinRoom_DeviceIdIsAutoGenerated() {
        JoinRoomRequestDTO payload = new JoinRoomRequestDTO();
        payload.setPin("1234");
        payload.setNickname("Juan");
        payload.setDeviceId(null);

        Room room = new Room("room-1", RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());
        RoomUser roomUser = new RoomUser("Juan", "generated-device-id", System.currentTimeMillis(), room);

        when(roomService.findRoomByPin("1234")).thenReturn(Optional.of(room));
        when(roomService.joinRoom(eq("room-1"), eq("Juan"), anyString())).thenReturn(roomUser);

        ResponseEntity<?> result = roomController.joinRoom(payload, response);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody())
                .extracting("nickname")
                .isEqualTo("Juan");
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: POST /api/rooms/{roomId}/upload
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Subir archivo: archivo válido en sala MULTIMEDIA")
    void testUploadFile_ValidFile() throws Exception {
        MultipartFile mockFile = mock(MultipartFile.class);

        when(roomService.saveFile("room-1", "Juan", mockFile))
                .thenReturn(java.util.concurrent.CompletableFuture.completedFuture(null));

        ResponseEntity<?> result = roomController.uploadFile("room-1", "Juan", mockFile);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody())
                .isInstanceOf(Map.class)
                .extracting("ok")
                .isEqualTo(true);

        verify(roomService, times(1)).saveFile("room-1", "Juan", mockFile);
    }

    @Test
    @DisplayName("Subir archivo: sala no encontrada retorna 404")
    void testUploadFile_RoomNotFound() throws Exception {
        MultipartFile mockFile = mock(MultipartFile.class);

        when(roomService.saveFile("invalid-room", "Juan", mockFile))
                .thenThrow(new NoSuchElementException("Sala no encontrada"));

        ResponseEntity<?> result = roomController.uploadFile("invalid-room", "Juan", mockFile);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(result.getBody())
                .extracting("error")
                .isEqualTo("Sala no encontrada");
    }

    @Test
    @DisplayName("Subir archivo: tipo MIME no permitido retorna 400")
    void testUploadFile_MimeTypeNotAllowed() throws Exception {
        MultipartFile mockFile = mock(MultipartFile.class);

        when(roomService.saveFile("room-1", "Juan", mockFile))
                .thenThrow(new IllegalArgumentException("Tipo de archivo no permitido"));

        ResponseEntity<?> result = roomController.uploadFile("room-1", "Juan", mockFile);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(result.getBody())
                .extracting("error")
                .isEqualTo("Tipo de archivo no permitido");
    }

    @Test
    @DisplayName("Subir archivo: tamaño excedido retorna 400")
    void testUploadFile_FileSizeExceeded() throws Exception {
        MultipartFile mockFile = mock(MultipartFile.class);

        when(roomService.saveFile("room-1", "Juan", mockFile))
                .thenThrow(new IllegalArgumentException("El archivo excede el tamaño máximo"));

        ResponseEntity<?> result = roomController.uploadFile("room-1", "Juan", mockFile);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(result.getBody())
                .extracting("error")
                .isEqualTo("El archivo excede el tamaño máximo");
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: GET /api/rooms/{roomId}/info
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Obtener info de sala: sala encontrada")
    void testRoomInfo_Found() {
        Room room = new Room("room-1", RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());

        when(roomService.getRoom("room-1")).thenReturn(room);

        ResponseEntity<?> result = roomController.roomInfo("room-1");

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody())
                .isInstanceOf(Map.class)
                .extracting("id")
                .isEqualTo("room-1");
        assertThat(result.getBody())
                .extracting("type")
                .isEqualTo(RoomType.TEXTO);

        verify(roomService, times(1)).getRoom("room-1");
    }

    @Test
    @DisplayName("Obtener info de sala: sala no encontrada retorna 404")
    void testRoomInfo_NotFound() {
        when(roomService.getRoom("invalid-room")).thenReturn(null);

        ResponseEntity<?> result = roomController.roomInfo("invalid-room");

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(result.getBody())
                .extracting("error")
                .isEqualTo("Sala no encontrada");
    }
}
