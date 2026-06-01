package ec.espe.chatsegurospring.controller;

import ec.espe.chatsegurospring.service.RoomService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Executor;

import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@DisplayName("ChatWebSocketController - Pruebas de Desconexión")
class ChatWebSocketControllerDisconnectTest {

    private RoomService.LeaveInfo createLeaveInfo(String roomId, String nickname) throws Exception {
        Class<?> leaveInfoClass = Class.forName("ec.espe.chatsegurospring.service.RoomService$LeaveInfo");
        Constructor<?> constructor = leaveInfoClass.getDeclaredConstructor(String.class, String.class);
        constructor.setAccessible(true);
        return (RoomService.LeaveInfo) constructor.newInstance(roomId, nickname);
    }

    @Test
    @DisplayName("Desconexión: sessionMap tiene datos, remove y envía mensaje de salida")
    void testHandleWebSocketDisconnect_removesSessionAndSendsLeave() throws Exception {
        RoomService rs = Mockito.mock(RoomService.class);
        SimpMessagingTemplate tmpl = Mockito.mock(SimpMessagingTemplate.class);
        Executor exec = Runnable::run;

        ChatWebSocketController ctrl = new ChatWebSocketController(rs, tmpl, exec);

        Field f = ChatWebSocketController.class.getDeclaredField("sessionMap");
        f.setAccessible(true);
        @SuppressWarnings("unchecked")
        Map<String, String[]> map = (Map<String, String[]>) f.get(ctrl);
        map.put("sess-1", new String[]{"room-1", "Juan"});

        SessionDisconnectEvent ev = Mockito.mock(SessionDisconnectEvent.class);
        when(ev.getSessionId()).thenReturn("sess-1");

        ctrl.handleWebSocketDisconnectListener(ev);

        verify(rs, times(1)).leaveRoom("room-1", "Juan");
        verify(tmpl, times(1)).convertAndSend(eq("/topic/room/room-1"), anyMap());
    }

    @Test
    @DisplayName("Desconexión: sessionId no existe en sessionMap, no hace nada")
    void testHandleWebSocketDisconnect_sessionNotInMap_doesNothing() throws Exception {
        RoomService rs = Mockito.mock(RoomService.class);
        SimpMessagingTemplate tmpl = Mockito.mock(SimpMessagingTemplate.class);
        Executor exec = Runnable::run;

        ChatWebSocketController ctrl = new ChatWebSocketController(rs, tmpl, exec);

        SessionDisconnectEvent ev = Mockito.mock(SessionDisconnectEvent.class);
        when(ev.getSessionId()).thenReturn("non-existent-session");

        ctrl.handleWebSocketDisconnectListener(ev);

        verify(rs, never()).leaveRoom(anyString(), anyString());
        verify(tmpl, never()).convertAndSend(anyString(), anyMap());
    }

    @Test
    @DisplayName("Desconexión: leaveRoomByDeviceId retorna info con room y nickname")
    void testHandleWebSocketDisconnect_leaveByDeviceId_returnsInfo() throws Exception {
        RoomService rs = Mockito.mock(RoomService.class);
        SimpMessagingTemplate tmpl = Mockito.mock(SimpMessagingTemplate.class);
        Executor exec = Runnable::run;

        ChatWebSocketController ctrl = new ChatWebSocketController(rs, tmpl, exec);

        RoomService.LeaveInfo leaveInfo = createLeaveInfo("room-2", "Pedro");
        when(rs.leaveRoomByDeviceId("device-123")).thenReturn(Optional.of(leaveInfo));

        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.create();
        accessor.setSessionAttributes(Map.of("deviceId", "device-123"));
        Message<byte[]> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());
        SessionDisconnectEvent ev = new SessionDisconnectEvent(this, message, "unknown-session", CloseStatus.NORMAL);

        ctrl.handleWebSocketDisconnectListener(ev);

        verify(rs, times(1)).leaveRoomByDeviceId("device-123");
        verify(tmpl, times(1)).convertAndSend(eq("/topic/room/room-2"), anyMap());
    }

    @Test
    @DisplayName("Desconexión: leaveRoomByDeviceId retorna empty, no envía mensaje")
    void testHandleWebSocketDisconnect_leaveByDeviceId_empty() throws Exception {
        RoomService rs = Mockito.mock(RoomService.class);
        SimpMessagingTemplate tmpl = Mockito.mock(SimpMessagingTemplate.class);
        Executor exec = Runnable::run;

        ChatWebSocketController ctrl = new ChatWebSocketController(rs, tmpl, exec);

        when(rs.leaveRoomByDeviceId("device-123")).thenReturn(Optional.empty());

        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.create();
        accessor.setSessionAttributes(Map.of("deviceId", "device-123"));
        Message<byte[]> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());
        SessionDisconnectEvent ev = new SessionDisconnectEvent(this, message, "unknown-session", CloseStatus.NORMAL);

        ctrl.handleWebSocketDisconnectListener(ev);

        verify(rs, times(1)).leaveRoomByDeviceId("device-123");
        verify(tmpl, never()).convertAndSend(anyString(), anyMap());
    }

    @Test
    @DisplayName("Desconexión: sessionAttributes null, no hace nada")
    void testHandleWebSocketDisconnect_sessionAttributesNull() throws Exception {
        RoomService rs = Mockito.mock(RoomService.class);
        SimpMessagingTemplate tmpl = Mockito.mock(SimpMessagingTemplate.class);
        Executor exec = Runnable::run;

        ChatWebSocketController ctrl = new ChatWebSocketController(rs, tmpl, exec);

        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.create();
        // no attributes
        Message<byte[]> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());
        SessionDisconnectEvent ev = new SessionDisconnectEvent(this, message, "unknown-session", CloseStatus.NORMAL);

        ctrl.handleWebSocketDisconnectListener(ev);

        verify(rs, never()).leaveRoomByDeviceId(anyString());
        verify(tmpl, never()).convertAndSend(anyString(), anyMap());
    }

    @Test
    @DisplayName("Desconexión: deviceId vacío no ejecuta leaveRoomByDeviceId")
    void testHandleWebSocketDisconnect_emptyDeviceId() throws Exception {
        RoomService rs = Mockito.mock(RoomService.class);
        SimpMessagingTemplate tmpl = Mockito.mock(SimpMessagingTemplate.class);
        Executor exec = Runnable::run;

        ChatWebSocketController ctrl = new ChatWebSocketController(rs, tmpl, exec);

        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.create();
        accessor.setSessionAttributes(Map.of("deviceId", "   "));
        Message<byte[]> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());
        SessionDisconnectEvent ev = new SessionDisconnectEvent(this, message, "unknown-session", CloseStatus.NORMAL);

        ctrl.handleWebSocketDisconnectListener(ev);

        verify(rs, never()).leaveRoomByDeviceId(anyString());
        verify(tmpl, never()).convertAndSend(anyString(), anyMap());
    }

    @Test
    @DisplayName("Desconexión: deviceId no es String, no hace nada")
    void testHandleWebSocketDisconnect_deviceIdNotString() throws Exception {
        RoomService rs = Mockito.mock(RoomService.class);
        SimpMessagingTemplate tmpl = Mockito.mock(SimpMessagingTemplate.class);
        Executor exec = Runnable::run;

        ChatWebSocketController ctrl = new ChatWebSocketController(rs, tmpl, exec);

        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.create();
        accessor.setSessionAttributes(Map.of("deviceId", 12345));
        Message<byte[]> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());
        SessionDisconnectEvent ev = new SessionDisconnectEvent(this, message, "unknown-session", CloseStatus.NORMAL);

        ctrl.handleWebSocketDisconnectListener(ev);

        verify(rs, never()).leaveRoomByDeviceId(anyString());
        verify(tmpl, never()).convertAndSend(anyString(), anyMap());
    }
}