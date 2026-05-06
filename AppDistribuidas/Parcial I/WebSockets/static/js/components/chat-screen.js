import { state } from '../store/state.js';
import './message-bubble.js';

class ChatScreen extends HTMLElement {
    connectedCallback() {
        this.onStateChange = () => this.render();
        window.addEventListener('state:change', this.onStateChange);
        this.render();
    }

    disconnectedCallback() {
        window.removeEventListener('state:change', this.onStateChange);
    }

    render() {
        this.innerHTML = `
            <div class="glass-container chat-container">
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <h3>Usuarios</h3>
                    </div>
                    <ul class="user-list" id="userList">
                        ${state.users.map(user => `
                            <li class="user-item">
                                <span class="status-dot"></span>
                                ${user} ${user === state.username ? '(Tu)' : ''}
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
                        ${state.messages.map(msg => {
                            if (msg.type === 'system') {
                                return `<message-bubble data-type="system" data-text="${msg.text}"></message-bubble>`;
                            }
                            const isOwn = msg.username === state.username;
                            return `<message-bubble data-type="user" data-username="${msg.username}" data-message="${msg.message}" data-timestamp="${msg.timestamp || ''}" data-own="${isOwn ? '1' : '0'}"></message-bubble>`;
                        }).join('')}
                    </div>
                    <div class="input-area">
                        <input type="text" id="messageInput" placeholder="Escribe un mensaje..." autocomplete="off">
                        <button class="btn-primary" id="sendBtn">Enviar</button>
                    </div>
                </main>
            </div>
        `;

        const input = this.querySelector('#messageInput');
        const btn = this.querySelector('#sendBtn');
        const exitBtn = this.querySelector('#exitBtn');
        const area = this.querySelector('#messagesArea');

        const send = () => {
            const message = input.value.trim();
            if (message) {
                this.dispatchEvent(new CustomEvent('chat:send', {
                    detail: { message },
                    bubbles: true
                }));
                input.value = '';
            }
        };

        btn.addEventListener('click', send);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') send();
        });
        exitBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('chat:exit', { bubbles: true }));
        });

        if (area) area.scrollTop = area.scrollHeight;
        input.focus();
    }
}

customElements.define('chat-screen', ChatScreen);
