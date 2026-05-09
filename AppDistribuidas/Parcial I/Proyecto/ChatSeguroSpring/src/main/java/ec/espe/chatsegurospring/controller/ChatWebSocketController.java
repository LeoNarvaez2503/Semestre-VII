package ec.espe.chatsegurospring.controller;

import ec.espe.chatsegurospring.model.Room;
import ec.espe.chatsegurospring.service.RoomService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class ChatWebSocketController {

    private final RoomService roomService;

    public ChatWebSocketController(RoomService roomService) {
        this.roomService = roomService;
    }

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Map<String, Object> sendMessage(@DestinationVariable String roomId, @Payload Map<String, String> payload) {
        String nickname = payload.get("nickname");
        String message = payload.get("message");

        Room room = roomService.getRoom(roomId);
        if (room == null) {
            return Map.of("error", "Sala no encontrada");
        }

        // Validate that the sender is actually a member of this room
        if (nickname == null || !roomService.isMember(roomId, nickname)) {
            return Map.of("error", "No eres miembro de esta sala");
        }

        if (message == null || message.isBlank()) {
            return Map.of("error", "El mensaje no puede estar vacío");
        }

        return Map.of(
                "roomId", roomId,
                "nickname", nickname,
                "message", message,
                "timestamp", System.currentTimeMillis()
        );
    }
}
