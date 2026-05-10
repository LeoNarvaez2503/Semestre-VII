package ec.espe.chatsegurospring.controller;

import ec.espe.chatsegurospring.BaseTest;
import ec.espe.chatsegurospring.model.Room;
import ec.espe.chatsegurospring.model.RoomType;
import ec.espe.chatsegurospring.service.RoomService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@DisplayName("ChatWebSocketController - Pruebas Unitarias")
class ChatWebSocketControllerTest extends BaseTest {

    @Mock
    private RoomService roomService;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private ChatWebSocketController chatWebSocketController;

    // ─────────────────────────────────────────────────────────────
    // TESTS: @MessageMapping("/chat/{roomId}") - sendMessage()
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Enviar mensaje: mensaje válido se transmite a todos")
    void testSendMessage_ValidMessage() {
        Executor taskExecutor = Executors.newSingleThreadExecutor();
        ReflectionTestUtils.setField(chatWebSocketController, "taskExecutor", taskExecutor);

        String roomId = "room-1";
        String nickname = "Juan";
        String message = "Hola a todos!";

        Room room = new Room(roomId, RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());

        Map<String, String> payload = new HashMap<>();
        payload.put("nickname", nickname);
        payload.put("message", message);

        when(roomService.getRoom(roomId)).thenReturn(room);
        when(roomService.isMember(roomId, nickname)).thenReturn(true);
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any(Object.class));

        assertThatCode(() -> chatWebSocketController.sendMessage(roomId, payload))
                .doesNotThrowAnyException();

        // Esperar a que se complete el async
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        verify(roomService, times(1)).getRoom(roomId);
        verify(roomService, times(1)).isMember(roomId, nickname);
        verify(messagingTemplate, timeout(1000).times(1))
                .convertAndSend(eq("/topic/room/" + roomId), any(Object.class));
    }

    @Test
    @DisplayName("Enviar mensaje: sala no encontrada envía error")
    void testSendMessage_RoomNotFound() {
        String roomId = "invalid-room";
        Map<String, String> payload = new HashMap<>();
        payload.put("nickname", "Juan");
        payload.put("message", "Mensaje");

        when(roomService.getRoom(roomId)).thenReturn(null);
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any(Object.class));

        chatWebSocketController.sendMessage(roomId, payload);

        verify(messagingTemplate, timeout(1000).times(1))
                .convertAndSend(eq("/topic/room/" + roomId), any(Object.class));
    }

    @Test
    @DisplayName("Enviar mensaje: usuario no es miembro envía error")
    void testSendMessage_UserNotMember() {
        String roomId = "room-1";
        String nickname = "Intruso";

        Room room = new Room(roomId, RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());

        Map<String, String> payload = new HashMap<>();
        payload.put("nickname", nickname);
        payload.put("message", "Mensaje");

        when(roomService.getRoom(roomId)).thenReturn(room);
        when(roomService.isMember(roomId, nickname)).thenReturn(false);
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any(Object.class));

        chatWebSocketController.sendMessage(roomId, payload);

        verify(messagingTemplate, timeout(1000).times(1))
                .convertAndSend(eq("/topic/room/" + roomId), any(Object.class));
    }

    @Test
    @DisplayName("Enviar mensaje: mensaje vacío envía error")
    void testSendMessage_EmptyMessage() {
        String roomId = "room-1";
        String nickname = "Juan";

        Room room = new Room(roomId, RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());

        Map<String, String> payload = new HashMap<>();
        payload.put("nickname", nickname);
        payload.put("message", "   "); // Solo espacios

        when(roomService.getRoom(roomId)).thenReturn(room);
        when(roomService.isMember(roomId, nickname)).thenReturn(true);
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any(Object.class));

        chatWebSocketController.sendMessage(roomId, payload);

        verify(messagingTemplate, timeout(1000).times(1))
                .convertAndSend(eq("/topic/room/" + roomId), any(Object.class));
    }

    @Test
    @DisplayName("Enviar mensaje: broadcast es asincrónico (no bloquea)")
    void testSendMessage_BroadcastIsAsynchronous() {
        Executor taskExecutor = Executors.newSingleThreadExecutor();
        ReflectionTestUtils.setField(chatWebSocketController, "taskExecutor", taskExecutor);

        String roomId = "room-1";
        String nickname = "Juan";

        Room room = new Room(roomId, RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());

        Map<String, String> payload = new HashMap<>();
        payload.put("nickname", nickname);
        payload.put("message", "Mensaje async");

        when(roomService.getRoom(roomId)).thenReturn(room);
        when(roomService.isMember(roomId, nickname)).thenReturn(true);
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any(Object.class));

        long startTime = System.currentTimeMillis();
        chatWebSocketController.sendMessage(roomId, payload);
        long endTime = System.currentTimeMillis();

        // El método debe retornar rápidamente (broadcast es async)
        long duration = endTime - startTime;
        assert duration < 100 : "sendMessage debe ser no-bloqueante";

        verify(messagingTemplate, timeout(1000).times(1))
                .convertAndSend(eq("/topic/room/" + roomId), any(Object.class));
    }

    @Test
    @DisplayName("Enviar mensaje: timestamp incluido en mensaje enviado")
    void testSendMessage_TimestampIncluded() {
        Executor taskExecutor = Executors.newSingleThreadExecutor();
        ReflectionTestUtils.setField(chatWebSocketController, "taskExecutor", taskExecutor);

        String roomId = "room-1";
        String nickname = "Juan";
        String message = "Test";

        Room room = new Room(roomId, RoomType.TEXTO, "hash", "digest", System.currentTimeMillis());

        Map<String, String> payload = new HashMap<>();
        payload.put("nickname", nickname);
        payload.put("message", message);

        when(roomService.getRoom(roomId)).thenReturn(room);
        when(roomService.isMember(roomId, nickname)).thenReturn(true);
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any(Object.class));

        chatWebSocketController.sendMessage(roomId, payload);

        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        verify(messagingTemplate, timeout(1000).times(1))
                .convertAndSend(eq("/topic/room/" + roomId), any(Object.class));
    }
}
