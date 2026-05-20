import './components/login-screen.js';
import './components/chat-screen.js';
import { state, setState, addMessage, resetState, getState, markMessageRead } from './store/state.js';
import { connectSocket, disconnectSocket, sendMessage, sendRead } from './services/socket-service.js';

const app = document.getElementById('app');

function render() {
    if (!state.username || !state.room) {
        const error = state.loginError || '';
        app.innerHTML = `<login-screen data-error="${error}"></login-screen>`;
    } else {
        app.innerHTML = '<chat-screen></chat-screen>';
    }
}

app.addEventListener('login:submit', (e) => {
    const username = e.detail.username;
    const room = e.detail.room;
    if (!username || !room) return;
    setState({ username, room, loginError: '' });
    connectSocket({
        onStateChange: setState,
        onMessage: addMessage,
        onMessageRead: ({ messageId, username }) => {
            markMessageRead(messageId, username);
        },
        getState
    });
});

app.addEventListener('chat:send', (e) => {
    sendMessage(e.detail.message, e.detail.ttlSeconds);
});

app.addEventListener('chat:read', (e) => {
    const messageId = e.detail.messageId;
    if (!messageId) return;
    sendRead(messageId);
    markMessageRead(messageId, state.username);
});

app.addEventListener('chat:exit', () => {
    disconnectSocket();
    resetState();
});

window.addEventListener('state:change', render);
render();
