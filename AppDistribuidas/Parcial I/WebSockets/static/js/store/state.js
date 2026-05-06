const state = {
    username: '',
    connected: false,
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
    state.messages = state.messages.concat(msg);
    notify();
}

export function resetState() {
    state.username = '';
    state.connected = false;
    state.users = [];
    state.messages = [];
    notify();
}

export function getState() {
    return state;
}

export { state };
