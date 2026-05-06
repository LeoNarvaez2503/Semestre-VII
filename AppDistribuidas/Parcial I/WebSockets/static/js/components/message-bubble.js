class MessageBubble extends HTMLElement {
    static get observedAttributes() {
        return ['data-type', 'data-text', 'data-username', 'data-message', 'data-timestamp', 'data-own'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
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

        this.innerHTML = `
            <div class="message-bubble ${isOwn ? 'message-own' : 'message-other'}">
                <div class="message-info">
                    <span class="sender">${isOwn ? 'Tu' : username}</span>
                    <span class="time">${timestamp}</span>
                </div>
                <div class="text">${message}</div>
            </div>
        `;
    }
}

customElements.define('message-bubble', MessageBubble);
