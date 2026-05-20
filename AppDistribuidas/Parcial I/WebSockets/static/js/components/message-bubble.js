class MessageBubble extends HTMLElement {
    static get observedAttributes() {
        return ['data-type', 'data-text', 'data-username', 'data-message', 'data-timestamp', 'data-own', 'data-readby', 'data-expires-at'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    disconnectedCallback() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    render() {
        const type = this.getAttribute('data-type') || 'user';
        if (type === 'system') {
            const text = this.getAttribute('data-text') || '';
            this.innerHTML = `<div class="system-message">${text}</div>`;
            return;
        }

        const username = this.getAttribute('data-username') || '';
        const message = this.getAttribute('data-message') || '';
        const timestamp = this.getAttribute('data-timestamp') || '';
        const isOwn = this.getAttribute('data-own') === '1';
        const readByRaw = this.getAttribute('data-readby') || '';
        const readBy = readByRaw ? readByRaw.split(',').filter(Boolean) : [];
        const readCount = readBy.length;
        const statusIcon = readCount > 0 ? 'vv' : 'v';
        const statusText = readCount > 0 ? `Visto por ${readCount}` : 'Enviado';
        const expiresAtRaw = this.getAttribute('data-expires-at');
        const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : 0;
        const remaining = expiresAt ? Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)) : 0;

        this.innerHTML = `
            <div class="message-bubble ${isOwn ? 'message-own' : 'message-other'}">
                <div class="message-info">
                    <span class="sender">${isOwn ? 'Tu' : username}</span>
                    <span class="time">${timestamp}</span>
                </div>
                <div class="text">${message}</div>
                ${expiresAt ? `<div class="message-ttl">TTL: ${remaining}s</div>` : ''}
                ${isOwn ? `<div class="message-status">${statusIcon} ${statusText}</div>` : ''}
            </div>
        `;

        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        if (expiresAt) {
            this._timer = setInterval(() => {
                const ttlEl = this.querySelector('.message-ttl');
                if (!ttlEl) return;
                const nextRemaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
                ttlEl.textContent = `TTL: ${nextRemaining}s`;
                if (nextRemaining <= 0) {
                    clearInterval(this._timer);
                    this._timer = null;
                }
            }, 1000);
        }
    }
}

customElements.define('message-bubble', MessageBubble);
