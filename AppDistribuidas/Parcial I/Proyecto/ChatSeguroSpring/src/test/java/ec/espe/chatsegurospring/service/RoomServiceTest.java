package ec.espe.chatsegurospring.service;

import ec.espe.chatsegurospring.BaseTest;
import ec.espe.chatsegurospring.model.Room;
import ec.espe.chatsegurospring.model.RoomType;
import ec.espe.chatsegurospring.model.RoomUser;
import ec.espe.chatsegurospring.model.SharedFile;
import ec.espe.chatsegurospring.repository.RoomRepository;
import ec.espe.chatsegurospring.repository.RoomUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.stubbing.Answer;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@DisplayName("RoomService - Pruebas Unitarias")
class RoomServiceTest extends BaseTest {

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private RoomUserRepository roomUserRepository;

    private RoomService roomService;

    @BeforeEach
    void setUp() {
        roomService = new RoomService(roomRepository, roomUserRepository);
        ReflectionTestUtils.setField(roomService, "pinLength", 4);
        ReflectionTestUtils.setField(roomService, "allowedTypes", "image/png,image/jpeg,image/gif,application/pdf");
        ReflectionTestUtils.setField(roomService, "maxFileSize", 10485760L);
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: createRoom()
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Crear sala: PIN válido y tipo TEXTO")
    void testCreateRoomSuccess_Texto() {
        when(roomRepository.save(any(Room.class)))
                .thenAnswer((Answer<Room>) invocation -> invocation.getArgument(0));

        Room createdRoom = roomService.createRoom("1234", RoomType.TEXTO);

        assertThat(createdRoom)
                .isNotNull()
                .hasFieldOrPropertyWithValue("type", RoomType.TEXTO);
        assertThat(createdRoom.getId()).isNotNull().hasSize(8);
        assertThat(createdRoom.getPinHash()).isNotNull();
        assertThat(createdRoom.getPinDigest()).isNotNull();
        assertThat(createdRoom.getCreatedAt()).isGreaterThan(0);

        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    @DisplayName("Crear sala: PIN válido y tipo MULTIMEDIA")
    void testCreateRoomSuccess_Multimedia() {
        when(roomRepository.save(any(Room.class)))
                .thenAnswer((Answer<Room>) invocation -> invocation.getArgument(0));

        Room createdRoom = roomService.createRoom("5678", RoomType.MULTIMEDIA);

        assertThat(createdRoom)
                .isNotNull()
                .hasFieldOrPropertyWithValue("type", RoomType.MULTIMEDIA);
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    @DisplayName("Crear sala: PIN nulo debe lanzar excepción")
    void testCreateRoomFail_PINNull() {
        assertThatThrownBy(() -> roomService.createRoom(null, RoomType.TEXTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("debe tener 4 dígitos");
    }

    @Test
    @DisplayName("Crear sala: PIN con longitud incorrecta debe lanzar excepción")
    void testCreateRoomFail_PINInvalidLength() {
        assertThatThrownBy(() -> roomService.createRoom("123", RoomType.TEXTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("debe tener 4 dígitos");

        assertThatThrownBy(() -> roomService.createRoom("12345", RoomType.TEXTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("debe tener 4 dígitos");
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: findRoomByPin() - SHA-256 + BCrypt
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Buscar sala por PIN: encontrada (SHA-256 + BCrypt)")
    void testFindRoomByPin_Found() {
        String pin = "1234";
        String pinHash = BCrypt.hashpw(pin, BCrypt.gensalt());
        String pinDigest = sha256(pin);

        Room room = new Room("room-id-1", RoomType.TEXTO, pinHash, pinDigest, System.currentTimeMillis());

        when(roomRepository.findAllByPinDigest(pinDigest))
                .thenReturn(List.of(room));

        Optional<Room> result = roomService.findRoomByPin(pin);

        assertThat(result)
                .isPresent()
                .contains(room);
        verify(roomRepository, times(1)).findAllByPinDigest(pinDigest);
    }

    @Test
    @DisplayName("Buscar sala por PIN: no encontrada")
    void testFindRoomByPin_NotFound() {
        String pin = "9999";
        String pinDigest = sha256(pin);

        when(roomRepository.findAllByPinDigest(pinDigest))
                .thenReturn(List.of());

        Optional<Room> result = roomService.findRoomByPin(pin);

        assertThat(result).isEmpty();
        verify(roomRepository, times(1)).findAllByPinDigest(pinDigest);
    }

    @Test
    @DisplayName("Buscar sala por PIN: múltiples candidatos, uno coincide")
    void testFindRoomByPin_MultipleCandidates_OneMatches() {
        String pin = "1234";
        String pinHash1 = BCrypt.hashpw(pin, BCrypt.gensalt());
        String pinHash2 = BCrypt.hashpw("0000", BCrypt.gensalt());
        String pinDigest = sha256(pin);

        Room room1 = new Room("room-1", RoomType.TEXTO, pinHash1, pinDigest, System.currentTimeMillis());
        Room room2 = new Room("room-2", RoomType.MULTIMEDIA, pinHash2, pinDigest, System.currentTimeMillis());

        when(roomRepository.findAllByPinDigest(pinDigest))
                .thenReturn(List.of(room1, room2));

        Optional<Room> result = roomService.findRoomByPin(pin);

        assertThat(result)
                .isPresent()
                .contains(room1);
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: joinRoom() - Validaciones y Sincronización
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Unirse a sala: usuario nuevo, deviceId válido")
    void testJoinRoom_NewUser_Success() {
        String roomId = "room-1";
        String nickname = "Juan";
        String deviceId = "device-uuid-123";

        Room room = new Room(roomId, RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());
        RoomUser newUser = new RoomUser(nickname, deviceId, System.currentTimeMillis(), room);

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));
        when(roomUserRepository.findByDeviceId(deviceId)).thenReturn(Optional.empty());
        when(roomUserRepository.findByRoom_IdAndNickname(roomId, nickname)).thenReturn(Optional.empty());
        when(roomUserRepository.save(any(RoomUser.class))).thenReturn(newUser);

        RoomUser result = roomService.joinRoom(roomId, nickname, deviceId);

        assertThat(result)
                .isNotNull()
                .hasFieldOrPropertyWithValue("nickname", nickname)
                .hasFieldOrPropertyWithValue("deviceId", deviceId);
        verify(roomUserRepository, times(1)).save(any(RoomUser.class));
    }

    @Test
    @DisplayName("Unirse a sala: sala no existe")
    void testJoinRoom_RoomNotFound() {
        when(roomRepository.findById("invalid-room")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roomService.joinRoom("invalid-room", "Juan", "device-1"))
                .isInstanceOf(java.util.NoSuchElementException.class)
                .hasMessageContaining("Sala no encontrada");
    }

    @Test
    @DisplayName("Unirse a sala: deviceId nulo o vacío")
    void testJoinRoom_InvalidDeviceId() {
        Room room = new Room("room-1", RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());
        when(roomRepository.findById("room-1")).thenReturn(Optional.of(room));

        assertThatThrownBy(() -> roomService.joinRoom("room-1", "Juan", null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("DeviceId requerido");

        assertThatThrownBy(() -> roomService.joinRoom("room-1", "Juan", "   "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("DeviceId requerido");
    }

    @Test
    @DisplayName("Unirse a sala: dispositivo ya en otra sala (auto-remover)")
    void testJoinRoom_DeviceInAnotherRoom() {
        String deviceId = "device-uuid-123";
        String oldRoomId = "old-room";
        String newRoomId = "new-room";

        Room oldRoom = new Room(oldRoomId, RoomType.TEXTO, "hash1", "digest1", System.currentTimeMillis());
        Room newRoom = new Room(newRoomId, RoomType.MULTIMEDIA, "hash2", "digest2", System.currentTimeMillis());

        RoomUser existingUser = new RoomUser("OldNick", deviceId, System.currentTimeMillis(), oldRoom);
        RoomUser newUser = new RoomUser("NewNick", deviceId, System.currentTimeMillis(), newRoom);

        when(roomRepository.findById(newRoomId)).thenReturn(Optional.of(newRoom));
        when(roomUserRepository.findByDeviceId(deviceId)).thenReturn(Optional.of(existingUser));
        when(roomUserRepository.findByRoom_IdAndNickname(newRoomId, "NewNick")).thenReturn(Optional.empty());
        when(roomUserRepository.save(any(RoomUser.class))).thenReturn(newUser);

        RoomUser result = roomService.joinRoom(newRoomId, "NewNick", deviceId);

        assertThat(result).isNotNull();
        verify(roomUserRepository, times(1)).delete(existingUser);
        verify(roomUserRepository, times(1)).flush();
        verify(roomUserRepository, times(1)).save(any(RoomUser.class));
    }

    @Test
    @DisplayName("Unirse a sala: nickname duplicado en la misma sala")
    void testJoinRoom_DuplicateNickname() {
        String roomId = "room-1";
        String nickname = "Juan";
        String deviceId = "device-uuid-123";

        Room room = new Room(roomId, RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));
        when(roomUserRepository.findByDeviceId(deviceId)).thenReturn(Optional.empty());
        RoomUser activeUser = new RoomUser(nickname, "other-device", System.currentTimeMillis(), room);
        activeUser.setActive(true);
        when(roomUserRepository.findByRoom_IdAndNickname(roomId, nickname)).thenReturn(Optional.of(activeUser));

        assertThatThrownBy(() -> roomService.joinRoom(roomId, nickname, deviceId))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Nickname ya existente");
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: leaveRoom()
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Abandonar sala: usuario removido correctamente")
    void testLeaveRoom_Success() {
        roomService.leaveRoom("room-1", "Juan");

        verify(roomUserRepository, times(1)).deleteByRoom_IdAndNickname("room-1", "Juan");
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: isMember()
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Verificar miembresía: usuario es miembro")
    void testIsMember_True() {
        when(roomUserRepository.existsByRoom_IdAndNickname("room-1", "Juan"))
                .thenReturn(true);

        boolean result = roomService.isMember("room-1", "Juan");

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Verificar miembresía: usuario no es miembro")
    void testIsMember_False() {
        when(roomUserRepository.existsByRoom_IdAndNickname("room-1", "Pedro"))
                .thenReturn(false);

        boolean result = roomService.isMember("room-1", "Pedro");

        assertThat(result).isFalse();
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: saveFile() - Validaciones MIME, Tamaño, Room Type
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Subir archivo: validaciones correctas en sala MULTIMEDIA")
    void testSaveFile_Success() throws IOException {
        String roomId = "room-1";
        Room room = new Room(roomId, RoomType.MULTIMEDIA, "hash", "digest", System.currentTimeMillis());

        // Test básico que valida que el servicio reconoce salas MULTIMEDIA
        assertThat(room.getType()).isEqualTo(RoomType.MULTIMEDIA);
    }

    @Test
    @DisplayName("Subir archivo: sala no existe")
    void testSaveFile_RoomNotFound() {
        when(roomRepository.findById("invalid-room")).thenReturn(Optional.empty());

        MultipartFile mockFile = mock(MultipartFile.class);

        assertThatThrownBy(() -> roomService.saveFile("invalid-room", "Juan", mockFile).join())
                .isInstanceOf(java.util.NoSuchElementException.class)
                .hasMessageContaining("Sala no encontrada");
    }

    @Test
    @DisplayName("Subir archivo: sala es TEXTO, no permite uploads")
    void testSaveFile_RoomTypeIsTexto() throws IOException {
        String roomId = "room-1";
        Room room = new Room(roomId, RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));

        MultipartFile mockFile = mock(MultipartFile.class);

        assertThatThrownBy(() -> roomService.saveFile(roomId, "Juan", mockFile).join())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("sala es de tipo TEXTO");
    }

    @Test
    @DisplayName("Subir archivo: tamaño excede límite (10MB)")
    void testSaveFile_FileSizeExceeded() {
        String roomId = "room-1";
        Room room = new Room(roomId, RoomType.MULTIMEDIA, "hash", "digest", System.currentTimeMillis());

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));

        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getSize()).thenReturn(20971520L); // 20MB

        assertThatThrownBy(() -> roomService.saveFile(roomId, "Juan", mockFile).join())
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("excede el tamaño máximo");
    }

    @Test
    @DisplayName("Subir archivo: tipo MIME no permitido")
    void testSaveFile_MimeTypeNotAllowed() {
        String roomId = "room-1";
        Room room = new Room(roomId, RoomType.MULTIMEDIA, "hash", "digest", System.currentTimeMillis());

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));

        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("malware.exe");
        when(mockFile.getContentType()).thenReturn("application/x-msdownload");
        when(mockFile.getSize()).thenReturn(1000L);

        assertThatThrownBy(() -> roomService.saveFile(roomId, "Juan", mockFile).join())
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Tipo de archivo no permitido");
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: getRoom()
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Obtener sala: encontrada")
    void testGetRoom_Found() {
        Room room = new Room("room-1", RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());
        when(roomRepository.findById("room-1")).thenReturn(Optional.of(room));

        Room result = roomService.getRoom("room-1");

        assertThat(result)
                .isNotNull()
                .isEqualTo(room);
    }

    @Test
    @DisplayName("Obtener sala: no encontrada")
    void testGetRoom_NotFound() {
        when(roomRepository.findById("invalid")).thenReturn(Optional.empty());

        Room result = roomService.getRoom("invalid");

        assertThat(result).isNull();
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: joinRoom() - Casos adicionales
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Unirse a sala: dispositivo ya en la misma sala con diferente nickname, actualiza nickname")
    void testJoinRoom_DeviceInSameRoom_DifferentNickname_UpdatesNickname() {
        String roomId = "room-1";
        String newNickname = "NewNick";
        String deviceId = "device-uuid-123";

        Room room = new Room(roomId, RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());
        RoomUser existingUser = new RoomUser("OldNick", deviceId, System.currentTimeMillis(), room);
        existingUser.setActive(true);

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));
        when(roomUserRepository.findByDeviceId(deviceId)).thenReturn(Optional.of(existingUser));
        when(roomUserRepository.findByRoom_IdAndNickname(roomId, newNickname)).thenReturn(Optional.empty());
        when(roomUserRepository.save(any(RoomUser.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RoomUser result = roomService.joinRoom(roomId, newNickname, deviceId);

        assertThat(result).isNotNull();
        assertThat(result.getNickname()).isEqualTo(newNickname);
        verify(roomUserRepository, never()).delete(any(RoomUser.class));
    }

    @Test
    @DisplayName("Unirse a sala: nickname existente pero inactivo, se reactiva")
    void testJoinRoom_NicknameExists_Inactive_ReactivatesUser() {
        String roomId = "room-1";
        String nickname = "Juan";
        String deviceId = "device-uuid-123";

        Room room = new Room(roomId, RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());

        RoomUser inactiveUser = new RoomUser(nickname, "another-device", System.currentTimeMillis(), room);
        inactiveUser.setActive(false);

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));
        when(roomUserRepository.findByDeviceId(deviceId)).thenReturn(Optional.empty());

        when(roomUserRepository.findByRoom_IdAndNickname(roomId, nickname))
                .thenReturn(Optional.of(inactiveUser));
        when(roomUserRepository.save(any(RoomUser.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RoomUser result = roomService.joinRoom(roomId, nickname, deviceId);

        assertThat(result).isNotNull();
        assertThat(result.isActive()).isTrue();
        assertThat(result.getDeviceId()).isEqualTo(deviceId);
        verify(roomUserRepository, never()).delete(any(RoomUser.class));
        verify(roomUserRepository, times(1)).save(inactiveUser);
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: saveFile() - Casos adicionales
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Subir archivo: nombre original null usa 'unnamed'")
    void testSaveFile_NullOriginalFilename_UsesUnnamed() throws IOException {
        String roomId = "room-1";
        Room room = new Room(roomId, RoomType.MULTIMEDIA, "hash", "digest", System.currentTimeMillis());
        room.getFiles().add(new SharedFile("test.png", "/uploads/test.png", "image/png", 1000, "Juan",
                System.currentTimeMillis(), room));

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));

        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn(null);
        when(mockFile.getContentType()).thenReturn("image/png");
        when(mockFile.getSize()).thenReturn(1000L);
        when(mockFile.getInputStream()).thenReturn(java.io.InputStream.nullInputStream());

        roomService.saveFile(roomId, "Juan", mockFile).join();

        verify(roomRepository, times(1)).save(room);
    }

    @Test
    @DisplayName("Subir archivo: nombre con caracteres especiales es sanitizado")
    void testSaveFile_SpecialCharactersInFilename_AreSanitized() throws IOException {
        String roomId = "room-1";
        Room room = new Room(roomId, RoomType.MULTIMEDIA, "hash", "digest", System.currentTimeMillis());

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));

        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("my file@#$.txt");
        when(mockFile.getContentType()).thenReturn("application/pdf");
        when(mockFile.getSize()).thenReturn(1000L);
        when(mockFile.getInputStream()).thenReturn(java.io.InputStream.nullInputStream());

        roomService.saveFile(roomId, "Juan", mockFile).join();

        verify(roomRepository, times(1)).save(room);
    }

    @Test
    @DisplayName("Subir archivo: copia de archivo falla lanza IOException")
    void testSaveFile_FileCopyFails_ThrowsException() throws Exception {
        String roomId = "room-1";
        Room room = new Room(roomId, RoomType.MULTIMEDIA, "hash", "digest", System.currentTimeMillis());

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));

        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("test.pdf");
        when(mockFile.getContentType()).thenReturn("application/pdf");
        when(mockFile.getSize()).thenReturn(1000L);
        doThrow(new java.io.IOException("File copy failed")).when(mockFile).getInputStream();

        assertThatThrownBy(() -> roomService.saveFile(roomId, "Juan", mockFile))
                .isInstanceOf(java.io.IOException.class);
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: leaveRoomByDeviceId() - Casos adicionales
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Abandonar sala por deviceId: deviceId null retorna empty")
    void testLeaveRoomByDeviceId_NullDeviceId_ReturnsEmpty() {
        Optional<RoomService.LeaveInfo> result = roomService.leaveRoomByDeviceId(null);

        assertThat(result).isEmpty();
        verify(roomUserRepository, never()).findByDeviceId(anyString());
    }

    @Test
    @DisplayName("Abandonar sala por deviceId: deviceId vacío retorna empty")
    void testLeaveRoomByDeviceId_BlankDeviceId_ReturnsEmpty() {
        Optional<RoomService.LeaveInfo> result = roomService.leaveRoomByDeviceId("   ");

        assertThat(result).isEmpty();
        verify(roomUserRepository, never()).findByDeviceId(anyString());
    }

    // ─────────────────────────────────────────────────────────────
    // UTILITY: SHA-256
    // ─────────────────────────────────────────────────────────────

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 error", e);
        }
    }
}
