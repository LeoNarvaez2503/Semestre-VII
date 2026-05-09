package ec.espe.chatsegurospring.service;

import ec.espe.chatsegurospring.model.Room;
import ec.espe.chatsegurospring.model.RoomType;
import ec.espe.chatsegurospring.model.RoomUser;
import ec.espe.chatsegurospring.model.SharedFile;
import ec.espe.chatsegurospring.repository.RoomRepository;
import ec.espe.chatsegurospring.repository.RoomUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class RoomService {

    private static final Logger log = LoggerFactory.getLogger(RoomService.class);

    private final RoomRepository roomRepository;
    private final RoomUserRepository roomUserRepository;
    private final Path uploadsRoot = Paths.get("uploads");

    @Value("${chat.room.pin-length}")
    private int pinLength;

    @Value("${chat.upload.allowed-types:image/png,image/jpeg,image/gif,application/pdf}")
    private String allowedTypes;

    @Value("${chat.upload.max-size:10485760}")
    private long maxFileSize;

    public RoomService(RoomRepository roomRepository, RoomUserRepository roomUserRepository) {
        this.roomRepository = roomRepository;
        this.roomUserRepository = roomUserRepository;
        try {
            Files.createDirectories(uploadsRoot);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio de uploads", e);
        }
    }

    // ─── Room CRUD ─────────────────────────────────────────────

    @Transactional
    public Room createRoom(String pin, RoomType type) {
        if (pin == null || pin.length() != pinLength) {
            throw new IllegalArgumentException("El PIN debe tener " + pinLength + " dígitos");
        }

        String roomId = UUID.randomUUID().toString().substring(0, 8);
        String pinHash = BCrypt.hashpw(pin, BCrypt.gensalt());
        String pinDigest = sha256(pin);

        Room room = new Room(roomId, type, pinHash, pinDigest, Instant.now().toEpochMilli());
        return roomRepository.save(room);
    }

    /**
     * O(1) PIN lookup using SHA-256 digest index,
     * followed by BCrypt verification for cryptographic security.
     * Returns the first room whose BCrypt hash matches.
     */
    @Transactional(readOnly = true)
    public Optional<Room> findRoomByPin(String pin) {
        String digest = sha256(pin);
        List<Room> candidates = roomRepository.findAllByPinDigest(digest);
        // Verify each candidate with BCrypt (handles SHA-256 collisions + duplicate PINs)
        return candidates.stream()
                .filter(room -> BCrypt.checkpw(pin, room.getPinHash()))
                .findFirst();
    }

    @Transactional(readOnly = true)
    public Room getRoom(String roomId) {
        return roomRepository.findById(roomId).orElse(null);
    }

    // ─── User Management (persistent) ──────────────────────────

    @Transactional
    public synchronized RoomUser joinRoom(String roomId, String nickname, String deviceId) {
        Room room = getRoom(roomId);
        if (room == null) {
            throw new NoSuchElementException("Sala no encontrada");
        }

        if (deviceId == null || deviceId.isBlank()) {
            throw new IllegalArgumentException("DeviceId requerido");
        }

        // Check if device is already registered
        Optional<RoomUser> existingUser = roomUserRepository.findByDeviceId(deviceId);
        if (existingUser.isPresent()) {
            RoomUser existing = existingUser.get();
            // If already in THIS room, return existing session
            if (existing.getRoom().getId().equals(roomId)) {
                return existing;
            }
            // If in ANOTHER room, auto-remove from old room (allow room switching)
            roomUserRepository.delete(existing);
            roomUserRepository.flush();
        }

        // Verify nickname uniqueness within the room
        if (roomUserRepository.existsByRoom_IdAndNickname(roomId, nickname)) {
            throw new IllegalStateException("Nickname ya existente en la sala");
        }

        RoomUser roomUser = new RoomUser(nickname, deviceId, Instant.now().toEpochMilli(), room);
        return roomUserRepository.save(roomUser);
    }

    @Transactional
    public synchronized void leaveRoom(String roomId, String nickname) {
        roomUserRepository.deleteByRoom_IdAndNickname(roomId, nickname);
    }

    /**
     * Verifies that a given nickname is a member of the specified room.
     */
    @Transactional(readOnly = true)
    public boolean isMember(String roomId, String nickname) {
        return roomUserRepository.existsByRoom_IdAndNickname(roomId, nickname);
    }

    // ─── File Upload ───────────────────────────────────────────

    /**
     * Guarda archivos de forma asíncrona usando el ThreadPoolTaskExecutor.
     * Cumple requisito: "Manejo de subidas de archivos en paralelo".
     */
    @Async("taskExecutor")
    @Transactional
    public CompletableFuture<Void> saveFile(String roomId, String nickname, MultipartFile file) throws IOException {
        log.info("[HILO UPLOAD] Procesando archivo '{}' en hilo: {}", file.getOriginalFilename(), Thread.currentThread().getName());
        Room room = getRoom(roomId);
        if (room == null) {
            throw new NoSuchElementException("Sala no encontrada");
        }

        // Validate room type: only MULTIMEDIA rooms accept file uploads
        if (room.getType() != RoomType.MULTIMEDIA) {
            throw new IllegalStateException("Esta sala es de tipo TEXTO, no permite subida de archivos");
        }

        // Validate file size
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("El archivo excede el tamaño máximo permitido (" + (maxFileSize / 1024 / 1024) + "MB)");
        }

        // Validate MIME type
        String contentType = file.getContentType();
        List<String> allowed = Arrays.asList(allowedTypes.split(","));
        if (contentType == null || allowed.stream().noneMatch(t -> t.trim().equalsIgnoreCase(contentType))) {
            throw new IllegalArgumentException("Tipo de archivo no permitido: " + contentType + ". Tipos permitidos: " + allowedTypes);
        }

        Path roomFolder = uploadsRoot.resolve(roomId);
        Files.createDirectories(roomFolder);

        String originalName = file.getOriginalFilename();
        if (originalName == null) {
            originalName = "unnamed";
        }
        String filename = System.currentTimeMillis() + "-" + originalName.replaceAll("[^a-zA-Z0-9._-]", "-");
        Path target = roomFolder.resolve(filename);
        Files.copy(file.getInputStream(), target);

        SharedFile sharedFile = new SharedFile(
                originalName,
                "/uploads/" + roomId + "/" + filename,
                contentType,
                file.getSize(),
                nickname,
                Instant.now().toEpochMilli(),
                room
        );
        room.getFiles().add(sharedFile);
        roomRepository.save(room);
        return CompletableFuture.completedFuture(null);
    }

    // ─── Utility ───────────────────────────────────────────────

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
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 no disponible", e);
        }
    }
}
