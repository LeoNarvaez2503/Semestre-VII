import './components/login-screen.js';
import './components/chat-screen.js';
import { state, setState, addMessage, resetState, getState } from './store/state.js';
import { connectSocket, disconnectSocket, sendMessage } from './services/socket-service.js';

const app = document.getElementById('app');

function render() {
    if (!state.connected && !state.username) {
        app.innerHTML = '<login-screen></login-screen>';
    } else {
        app.innerHTML = '<chat-screen></chat-screen>';
    }
}

app.addEventListener('login:submit', (e) => {
    const username = e.detail.username;
    if (!username) return;
    setState({ username });
    connectSocket({
        onStateChange: setState,
        onMessage: addMessage,
        getState
    });
});

app.addEventListener('chat:send', (e) => {
    sendMessage(e.detail.message);
});

app.addEventListener('chat:exit', () => {
    disconnectSocket();
    resetState();
});

window.addEventListener('state:change', render);
render();

function scrollToBottom() {
    const area = document.getElementById('messagesArea');
    if (area) {
        area.scrollTop = area.scrollHeight;
    }
}

// Start the app
init();
