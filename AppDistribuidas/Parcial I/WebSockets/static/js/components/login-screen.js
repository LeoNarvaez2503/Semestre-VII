class LoginScreen extends HTMLElement {
    static get observedAttributes() {
        return ['data-error'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const error = this.getAttribute('data-error') || '';
        this.innerHTML = `
            <div class="glass-container login-screen">
                <h2>Bienvenido</h2>
                <p style="color: var(--text-secondary)">Ingresa tu nombre de usuario para comenzar a chatear</p>
                ${error ? `<p style="font-size: 0.8rem; color: #ef4444;">${error}</p>` : ''}
                <div class="input-group">
                    <input type="text" id="usernameInput" placeholder="Nombre de usuario..." autocomplete="off">
                </div>
                <div class="input-group">
                    <input type="text" id="roomInput" placeholder="Sala privada..." autocomplete="off">
                </div>
                <button class="btn-primary" id="joinBtn">Entrar al Chat</button>
            </div>
        `;

        const input = this.querySelector('#usernameInput');
        const roomInput = this.querySelector('#roomInput');
        const btn = this.querySelector('#joinBtn');

        const join = () => {
            const username = input.value.trim();
            const room = roomInput.value.trim();
            if (username && room) {
                this.dispatchEvent(new CustomEvent('login:submit', {
                    detail: { username, room },
                    bubbles: true
                }));
            }
        };

        btn.addEventListener('click', join);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') join();
        });
        roomInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') join();
        });
        input.focus();
    }
}

customElements.define('login-screen', LoginScreen);
