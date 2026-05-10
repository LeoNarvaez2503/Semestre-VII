const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }

  return data;
}

// ─── Admin ──────────────────────────────────────────────

export async function adminLogin(username, password) {
  return request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function adminLogout() {
  return request('/admin/logout', { method: 'POST' });
}

export async function adminStatus() {
  return request('/admin/status');
}

export async function getAdminRooms() {
  return request('/admin/rooms');
}

// ─── Rooms ──────────────────────────────────────────────

export async function createRoom(pin, type) {
  return request('/rooms/create', {
    method: 'POST',
    body: JSON.stringify({ pin, type }),
  });
}

export async function joinRoom(pin, nickname, deviceId) {
  return request('/rooms/join', {
    method: 'POST',
    body: JSON.stringify({ pin, nickname, deviceId }),
  });
}

export async function getRoomInfo(roomId) {
  return request(`/rooms/${roomId}/info`);
}

// ─── File Upload ────────────────────────────────────────

export async function uploadFile(roomId, nickname, file) {
  const formData = new FormData();
  formData.append('nickname', nickname);
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/rooms/${roomId}/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }

  return data;
}
