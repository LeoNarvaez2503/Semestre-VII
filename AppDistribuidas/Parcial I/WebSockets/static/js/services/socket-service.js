let socket = null;

export function connectSocket({ onStateChange, onMessage, getState }) {
    if (socket) return socket;

    socket = io();

    socket.on('connect', () => {
        onStateChange({ connected: true });
        const username = getState().username;
        if (username) {
            socket.emit('set_username', { username });
        }
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
            username: data.username,
            message: data.message,
            timestamp: data.timestamp
        });
    });

    socket.on('disconnect', () => {
        onStateChange({ connected: false });
    });

    return socket;
}

export function sendMessage(message) {
    if (socket && message) {
        socket.emit('chatMessage', { message });
    }
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
