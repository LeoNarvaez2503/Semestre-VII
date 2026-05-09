package ec.espe.chatsegurospring.controller;

import ec.espe.chatsegurospring.model.Room;
import ec.espe.chatsegurospring.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

@Controller
public class ChatWebSocketController {

    private static final Logger log = LoggerFactory.getLogger(ChatWebSocketController.class);

    private final RoomService roomService;
    private final SimpMessagingTemplate messagingTemplate;
    private final Executor taskExecutor;

    public ChatWebSocketController(RoomService roomService,
                                   SimpMessagingTemplate messagingTemplate,
                                   @Qualifier("taskExecutor") Executor taskExecutor) {
        this.roomService = roomService;
        this.messagingTemplate = messagingTemplate;
        this.taskExecutor = taskExecutor;
    }

    /**
     * Recibe mensajes STOMP y los retransmite (broadcast) a todos los suscriptores
     * de la sala usando un hilo dedicado del ThreadPoolTaskExecutor.
     * Cumple requisito: "Transmisión de mensajes a múltiples usuarios sin bloquear el servidor".
     */
    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable String roomId, @Payload Map<String, String> payload) {
        String nickname = payload.get("nickname");
        String message = payload.get("message");

        Room room = roomService.getRoom(roomId);
        if (room == null) {
            messagingTemplate.convertAndSend("/topic/room/" + roomId, Map.of("error", "Sala no encontrada"));
            return;
        }

        // Validate that the sender is actually a member of this room
        if (nickname == null || !roomService.isMember(roomId, nickname)) {
            messagingTemplate.convertAndSend("/topic/room/" + roomId, Map.of("error", "No eres miembro de esta sala"));
            return;
        }

        if (message == null || message.isBlank()) {
            messagingTemplate.convertAndSend("/topic/room/" + roomId, Map.of("error", "El mensaje no puede estar vacío"));
            return;
        }

        Map<String, Object> outgoing = Map.of(
                "roomId", roomId,
                "nickname", nickname,
                "message", message,
                "timestamp", System.currentTimeMillis()
        );

        // Broadcast asíncrono en hilo del pool → no bloquea el hilo WebSocket
        CompletableFuture.runAsync(() -> {
            log.info("[HILO BROADCAST] Enviando mensaje a /topic/room/{} en hilo: {}", roomId, Thread.currentThread().getName());
            messagingTemplate.convertAndSend("/topic/room/" + roomId, outgoing);
        }, taskExecutor);
    }
}

