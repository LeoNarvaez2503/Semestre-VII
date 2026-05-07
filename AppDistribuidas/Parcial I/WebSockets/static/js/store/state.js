let localIdCounter = 1;

const state = {
    username: '',
    room: '',
    connected: false,
    loginError: '',
    users: [],
    messages: []
};

function notify() {
    window.dispatchEvent(new CustomEvent('state:change'));
}

export function setState(patch) {
    Object.assign(state, patch);
    notify();
}

export function addMessage(msg) {
    if (!msg.id) {
        msg.localId = `local-${localIdCounter++}`;
    }
    if (msg.type === 'user') {
        const ttlSeconds = Number(msg.ttlSeconds || msg.ttl_seconds || 0);
        if (ttlSeconds > 0) {
            msg.ttlSeconds = ttlSeconds;
            msg.expiresAt = Date.now() + (ttlSeconds * 1000);
        }
    }
    if (msg.type === 'user' && !msg.readBy) {
        msg.readBy = [];
    }
    state.messages = state.messages.concat(msg);
    notify();

    scheduleMessageRemoval(msg);
}

export function removeMessage(messageId, localId) {
    state.messages = state.messages.filter(msg => {
        if (messageId && msg.id === messageId) return false;
        if (localId && msg.localId === localId) return false;
        return true;
    });
    notify();
}

function scheduleMessageRemoval(msg) {
    if (msg.type !== 'user' || !msg.ttlSeconds) return;
    const messageId = msg.id || null;
    const localId = msg.localId || null;
    const delay = msg.ttlSeconds * 1000;
    setTimeout(() => {
        removeMessage(messageId, localId);
    }, delay);
}

export function markMessageRead(messageId, username) {
    state.messages = state.messages.map(msg => {
        if (msg.type !== 'user' || msg.id !== messageId) return msg;
        const readBy = msg.readBy || [];
        if (!readBy.includes(username)) {
            return { ...msg, readBy: readBy.concat(username) };
        }
        return msg;
    });
    notify();
}

export function resetState() {
    state.username = '';
    state.room = '';
    state.connected = false;
    state.loginError = '';
    state.users = [];
    state.messages = [];
    localIdCounter = 1;
    notify();
}

export function getState() {
    return state;
}

export { state };
