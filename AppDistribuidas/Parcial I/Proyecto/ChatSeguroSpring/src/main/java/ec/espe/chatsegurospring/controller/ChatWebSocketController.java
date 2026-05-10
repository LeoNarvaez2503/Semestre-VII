package ec.espe.chatsegurospring.controller;

import ec.espe.chatsegurospring.model.Room;
import ec.espe.chatsegurospring.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executor;

@Controller
public class ChatWebSocketController {

    private static final Logger log = LoggerFactory.getLogger(ChatWebSocketController.class);

    private final RoomService roomService;
    private final SimpMessagingTemplate messagingTemplate;
    private final Executor taskExecutor;
    
    // Tracks sessionId -> [roomId, nickname]
    private final Map<String, String[]> sessionMap = new ConcurrentHashMap<>();

    public ChatWebSocketController(RoomService roomService,
                                   SimpMessagingTemplate messagingTemplate,
                                   @Qualifier("taskExecutor") Executor taskExecutor) {
        this.roomService = roomService;
        this.messagingTemplate = messagingTemplate;
        this.taskExecutor = taskExecutor;
    }

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable String roomId, @Payload Map<String, String> payload, SimpMessageHeaderAccessor headerAccessor) {
        String nickname = payload.get("nickname");
        String message = payload.get("message");
        String sessionId = headerAccessor.getSessionId();

        Room room = roomService.getRoom(roomId);
        if (room == null) {
            messagingTemplate.convertAndSend("/topic/room/" + roomId, Map.of("error", "Sala no encontrada"));
            return;
        }

        if (nickname == null || !roomService.isMember(roomId, nickname)) {
            messagingTemplate.convertAndSend("/topic/room/" + roomId, Map.of("error", "No eres miembro de esta sala"));
            return;
        }
        
        // Track session to remove user on disconnect
        if (sessionId != null) {
            sessionMap.put(sessionId, new String[]{roomId, nickname});
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

        CompletableFuture.runAsync(() -> {
            log.info("[HILO BROADCAST] Enviando mensaje a /topic/room/{} en hilo: {}", roomId, Thread.currentThread().getName());
            messagingTemplate.convertAndSend("/topic/room/" + roomId, outgoing);
        }, taskExecutor);
    }
    
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        String[] data = sessionMap.remove(sessionId);
        String roomId = null;
        String nickname = null;
        boolean alreadyLeft = false;

        if (data != null) {
            roomId = data[0];
            nickname = data[1];
            roomService.leaveRoom(roomId, nickname);
            alreadyLeft = true;
        } else {
            SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
            Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
            if (sessionAttributes != null) {
                Object deviceIdObj = sessionAttributes.get("deviceId");
                if (deviceIdObj instanceof String deviceId && !deviceId.isBlank()) {
                    RoomService.LeaveInfo info = roomService.leaveRoomByDeviceId(deviceId).orElse(null);
                    if (info != null) {
                        roomId = info.getRoomId();
                        nickname = info.getNickname();
                        alreadyLeft = true;
                    }
                }
            }
        }

        if (!alreadyLeft || roomId == null || nickname == null) {
            return;
        }

        log.info("Usuario desconectado de WS: {}, saliendo de sala: {}", nickname, roomId);

        Map<String, Object> outgoing = Map.of(
            "roomId", roomId,
            "nickname", "SISTEMA",
            "message", nickname + " ha abandonado la sala.",
            "timestamp", System.currentTimeMillis()
        );
        messagingTemplate.convertAndSend("/topic/room/" + roomId, outgoing);
    }
}

