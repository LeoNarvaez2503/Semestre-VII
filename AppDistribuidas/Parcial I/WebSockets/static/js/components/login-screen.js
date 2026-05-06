class LoginScreen extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="glass-container login-screen">
                <h2>Bienvenido</h2>
                <p style="color: var(--text-secondary)">Ingresa tu nombre de usuario para comenzar a chatear</p>
                <div class="input-group">
                    <input type="text" id="usernameInput" placeholder="Nombre de usuario..." autocomplete="off">
                </div>
                <button class="btn-primary" id="joinBtn">Entrar al Chat</button>
            </div>
        `;

        const input = this.querySelector('#usernameInput');
        const btn = this.querySelector('#joinBtn');

        const join = () => {
            const username = input.value.trim();
            if (username) {
                this.dispatchEvent(new CustomEvent('login:submit', {
                    detail: { username },
                    bubbles: true
                }));
            }
        };

        btn.addEventListener('click', join);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') join();
        });
        input.focus();
    }
}

customElements.define('login-screen', LoginScreen);
