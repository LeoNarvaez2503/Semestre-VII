// State Management
const state = {
    socket: null,
    username: '',
    connected: false,
    users: [],
    messages: []
};

// DOM Elements
const app = document.getElementById('app');

// Initialization
function init() {
    render();
}

// Components
function render() {
    if (!state.connected && !state.username) {
        app.innerHTML = LoginScreen();
        setupLoginListeners();
    } else {
        app.innerHTML = ChatScreen();
        setupChatListeners();
        scrollToBottom();
    }
}

function LoginScreen() {
    return `
        <div class="glass-container login-screen">
            <h2>Bienvenido</h2>
            <p style="color: var(--text-secondary)">Ingresa tu nombre de usuario para comenzar a chatear</p>
            <div class="input-group">
                <input type="text" id="usernameInput" placeholder="Nombre de usuario..." autocomplete="off">
            </div>
            <button class="btn-primary" id="joinBtn">Entrar al Chat</button>
        </div>
    `;
}

function ChatScreen() {
    return `
        <div class="glass-container chat-container">
            <aside class="sidebar">
                <div class="sidebar-header">
                    <h3>Usuarios</h3>
                </div>
                <ul class="user-list" id="userList">
                    ${state.users.map(user => `
                        <li class="user-item">
                            <span class="status-dot"></span>
                            ${user} ${user === state.username ? '(Tú)' : ''}
                        </li>
                    `).join('')}
                </ul>
            </aside>
            <main class="chat-main">
                <header class="chat-header">
                    <div>
                        <h2>Chat General</h2>
                        <p style="font-size: 0.8rem; color: var(--text-secondary)">Conectado como <strong>${state.username}</strong></p>
                    </div>
                    <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem; background: #ef4444; color: white;" id="exitBtn">Salir</button>
                </header>
                <div class="messages-area" id="messagesArea">
                    ${state.messages.map(msg => MessageBubble(msg)).join('')}
                </div>
                <div class="input-area">
                    <input type="text" id="messageInput" placeholder="Escribe un mensaje..." autocomplete="off">
                    <button class="btn-primary" id="sendBtn">Enviar</button>
                </div>
            </main>
        </div>
    `;
}

function MessageBubble(msg) {
    if (msg.type === 'system') {
        return `<div class="system-message">${msg.text}</div>`;
    }

    const isOwn = msg.username === state.username;
    return `
        <div class="message-bubble ${isOwn ? 'message-own' : 'message-other'}">
            <div class="message-info">
                <span class="sender">${isOwn ? 'Tú ' : msg.username}</span>
                <span class="time">${msg.timestamp}</span>
            </div>
            <div class="text">${msg.message}</div>
        </div>
    `;
}

// Event Listeners Setups
function setupLoginListeners() {
    const input = document.getElementById('usernameInput');
    const btn = document.getElementById('joinBtn');

    const join = () => {
        const val = input.value.trim();
        if (val) {
            state.username = val;
            connectToServer();
        }
    };

    btn.onclick = join;
    input.onkeypress = (e) => { if (e.key === 'Enter') join(); };
    input.focus();
}

function setupChatListeners() {
    const input = document.getElementById('messageInput');
    const btn = document.getElementById('sendBtn');
    const exitBtn = document.getElementById('exitBtn');

    const send = () => {
        const val = input.value.trim();
        if (val) {
            state.socket.emit('chatMessage', {
                message: val
            });
            input.value = '';
        }
    };

    btn.onclick = send;
    input.onkeypress = (e) => { if (e.key === 'Enter') send(); };
    exitBtn.onclick = () => {
        state.socket.disconnect();
        window.location.reload();
    };
    input.focus();
}

// Socket Logic
function connectToServer() {
    // En el navegador, si no se pasa URL, intenta conectar al mismo host
    state.socket = io();

    state.socket.on('connect', () => {
        state.connected = true;
        state.socket.emit('set_username', { username: state.username });
        render();
    });

    state.socket.on('user_joined', (data) => {
        addSystemMessage(`${data.username} se ha unido al chat`);
    });

    state.socket.on('user_left', (data) => {
        addSystemMessage(`${data.username} ha salido del chat`);
    });

    state.socket.on('user_list', (data) => {
        state.users = data.users;
        updateUserList();
    });

    state.socket.on('chatMessage', (data) => {
        state.messages.push(data);
        addMessageToUI(data);
    });

    state.socket.on('disconnect', () => {
        state.connected = false;
        render();
    });
}

// UI Helpers
function addSystemMessage(text) {
    const msg = { type: 'system', text };
    state.messages.push(msg);
    addMessageToUI(msg);
}

function addMessageToUI(msg) {
    const area = document.getElementById('messagesArea');
    if (area) {
        const div = document.createElement('div');
        div.innerHTML = MessageBubble(msg);
        area.appendChild(div.firstElementChild);
        scrollToBottom();
    }
}

function updateUserList() {
    const list = document.getElementById('userList');
    if (list) {
        list.innerHTML = state.users.map(user => `
            <li class="user-item">
                <span class="status-dot"></span>
                ${user} ${user === state.username ? '(Tú)' : ''}
            </li>
        `).join('');
    }
}

function scrollToBottom() {
    const area = document.getElementById('messagesArea');
    if (area) {
        area.scrollTop = area.scrollHeight;
    }
}

// Start the app
init();
