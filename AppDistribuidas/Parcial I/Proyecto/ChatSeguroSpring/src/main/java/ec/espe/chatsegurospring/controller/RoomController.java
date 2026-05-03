package ec.espe.chatsegurospring.controller;

import ec.espe.chatsegurospring.dto.JoinRoomRequestDTO;
import ec.espe.chatsegurospring.dto.RoomCreateRequestDTO;
import ec.espe.chatsegurospring.model.Room;
import ec.espe.chatsegurospring.model.RoomType;
import ec.espe.chatsegurospring.service.RoomService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/rooms")
@Validated
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRoom(@Valid @RequestBody RoomCreateRequestDTO payload) {
        RoomType type;
        try {
            type = RoomType.valueOf(payload.getType().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tipo de sala inválido"));
        }

        try {
            Room room = roomService.createRoom(payload.getPin(), type);
            return ResponseEntity.ok(Map.of("roomId", room.getId(), "type", room.getType()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinRoom(@Valid @RequestBody JoinRoomRequestDTO payload, HttpServletResponse response) {
        try {
            java.util.Optional<ec.espe.chatsegurospring.model.Room> roomOpt = roomService.findRoomByPin(payload.getPin());
            if (roomOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Sala no encontrada"));
            }

            ec.espe.chatsegurospring.model.Room room = roomOpt.get();
            String deviceId = payload.getDeviceId();
            if (deviceId == null || deviceId.isBlank()) {
                deviceId = java.util.UUID.randomUUID().toString();
            }

            roomService.joinRoom(room.getId(), payload.getNickname(), deviceId);
            Cookie cookie = new Cookie("deviceId", deviceId);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24);
            response.addCookie(cookie);

            return ResponseEntity.ok(Map.of(
                    "roomId", room.getId(),
                    "type", room.getType(),
                    "nickname", payload.getNickname(),
                    "deviceId", deviceId
            ));
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(404).body(Map.of("error", "Sala no encontrada"));
        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping(path = "/{roomId}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@PathVariable String roomId,
                                        @RequestParam String nickname,
                                        @RequestParam MultipartFile file) {
        try {
            roomService.saveFile(roomId, nickname, file).join();
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(404).body(Map.of("error", "Sala no encontrada"));
        } catch (IOException ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al guardar el archivo"));
        }
    }

    @GetMapping("/{roomId}/info")
    public ResponseEntity<?> roomInfo(@PathVariable String roomId) {
        Room room = roomService.getRoom(roomId);
        if (room == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Sala no encontrada"));
        }
        return ResponseEntity.ok(Map.of(
                "id", room.getId(),
                "type", room.getType(),
                "users", room.getUsers().keySet(),
                "files", room.getFiles()
        ));
    }
}
