let socket = null;

export function connectSocket({ onStateChange, onMessage, onMessageRead, getState }) {
    if (socket) {
        const username = getState().username;
        const room = getState().room;
        if (username && room) {
            socket.emit('set_username', { username, room });
        }
        return socket;
    }

    socket = io();

    socket.on('connect', () => {
        onStateChange({ connected: true });
        const username = getState().username;
        const room = getState().room;
        if (username && room) {
            socket.emit('set_username', { username, room });
        }
    });

    socket.on('username_rejected', data => {
        onStateChange({ username: '', room: '', loginError: data.reason || 'Nickname no disponible.' });
    });

    socket.on('username_accepted', data => {
        onStateChange({
            username: data.username || getState().username,
            room: data.room || getState().room,
            loginError: ''
        });
    });

    socket.on('user_joined', data => {
        onMessage({ type: 'system', text: `${data.username} se ha unido al chat` });
    });

    socket.on('user_left', data => {
        onMessage({ type: 'system', text: `${data.username} ha salido del chat` });
    });

    socket.on('user_list', data => {
        onStateChange({ users: data.users });
    });

    socket.on('chatMessage', data => {
        onMessage({
            type: 'user',
            id: data.id,
            username: data.username,
            message: data.message,
            timestamp: data.timestamp,
            readBy: [],
            ttlSeconds: data.ttl_seconds || data.ttlSeconds
        });
    });

    socket.on('messageRead', data => {
        if (onMessageRead) {
            onMessageRead({ messageId: data.message_id, username: data.username });
        }
    });

    socket.on('disconnect', () => {
        onStateChange({ connected: false });
    });

    return socket;
}

export function sendMessage(message, ttlSeconds) {
    if (socket && message) {
        const ttl = Number(ttlSeconds || 10);
        socket.emit('chatMessage', { message, ttl_seconds: ttl });
    }
}

export function sendRead(messageId) {
    if (socket && messageId) {
        socket.emit('readMessage', { message_id: messageId });
    }
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
