package ec.espe.chatsegurospring.service;

import ec.espe.chatsegurospring.model.Room;
import ec.espe.chatsegurospring.model.RoomType;
import ec.espe.chatsegurospring.model.SharedFile;
import ec.espe.chatsegurospring.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final Map<String, String> deviceRoom = new ConcurrentHashMap<>();
    private final Path uploadsRoot = Paths.get("uploads");

    @Value("${chat.room.pin-length}")
    private int pinLength;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
        try {
            Files.createDirectories(uploadsRoot);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio de uploads", e);
        }
    }

    @Transactional
    public Room createRoom(String pin, RoomType type) {
        if (pin == null || pin.length() != pinLength) {
            throw new IllegalArgumentException("El PIN debe tener " + pinLength + " dígitos");
        }

        String roomId = UUID.randomUUID().toString().substring(0, 8);
        String pinHash = BCrypt.hashpw(pin, BCrypt.gensalt());

        Room room = new Room(roomId, type, pinHash, Instant.now().toEpochMilli());
        return roomRepository.save(room);
    }

    @Transactional(readOnly = true)
    public Optional<Room> findRoomByPin(String pin) {
        return roomRepository.findAll().stream()
                .filter(room -> BCrypt.checkpw(pin, room.getPinHash()))
                .findFirst();
    }

    @Transactional(readOnly = true)
    public Room getRoom(String roomId) {
        return roomRepository.findById(roomId).orElse(null);
    }

    public synchronized void joinRoom(String roomId, String nickname, String deviceId) {
        Room room = getRoom(roomId);
        if (room == null) {
            throw new NoSuchElementException("Sala no encontrada");
        }

        if (deviceId == null) {
            throw new IllegalArgumentException("DeviceId requerido");
        }

        String existingRoom = deviceRoom.get(deviceId);
        if (existingRoom != null && !existingRoom.equals(roomId)) {
            throw new IllegalStateException("El dispositivo ya está en otra sala");
        }

        if (room.getUsers().containsKey(nickname)) {
            throw new IllegalStateException("Nickname ya existente en la sala");
        }

        room.getUsers().put(nickname, deviceId);
        deviceRoom.put(deviceId, roomId);
    }

    public synchronized void leaveRoom(String roomId, String nickname, String deviceId) {
        Room room = getRoom(roomId);
        if (room == null) {
            return;
        }
        room.getUsers().remove(nickname);
        deviceRoom.remove(deviceId);
    }

    @Async
    @Transactional
    public java.util.concurrent.CompletableFuture<Void> saveFile(String roomId, String nickname, MultipartFile file) throws IOException {
        Room room = getRoom(roomId);
        if (room == null) {
            throw new NoSuchElementException("Sala no encontrada");
        }

        Path roomFolder = uploadsRoot.resolve(roomId);
        Files.createDirectories(roomFolder);

        String filename = System.currentTimeMillis() + "-" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "-");
        Path target = roomFolder.resolve(filename);
        Files.copy(file.getInputStream(), target);

        SharedFile sharedFile = new SharedFile(file.getOriginalFilename(), "/uploads/" + roomId + "/" + filename, file.getContentType(), file.getSize(), nickname, Instant.now().toEpochMilli(), room);
        room.getFiles().add(sharedFile);
        roomRepository.save(room);
        return java.util.concurrent.CompletableFuture.completedFuture(null);
    }
}
