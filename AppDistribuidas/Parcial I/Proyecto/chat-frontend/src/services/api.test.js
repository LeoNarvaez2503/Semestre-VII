import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from './api';

global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('adminLogin makes POST request', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'abc' }),
    });

    const result = await api.adminLogin('admin', '1234');
    
    expect(fetch).toHaveBeenCalledWith('/api/admin/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: '1234' }),
    }));
    expect(result).toEqual({ token: 'abc' });
  });

  it('adminLogout makes POST request', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await api.adminLogout();
    expect(fetch).toHaveBeenCalledWith('/api/admin/logout', expect.objectContaining({
      method: 'POST',
    }));
    expect(result.success).toBe(true);
  });

  it('adminStatus makes GET request', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ authenticated: true }) });
    const result = await api.adminStatus();
    expect(fetch).toHaveBeenCalledWith('/api/admin/status', expect.any(Object));
    expect(result.authenticated).toBe(true);
  });

  it('getAdminRooms makes GET request', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ([]) });
    const result = await api.getAdminRooms();
    expect(fetch).toHaveBeenCalledWith('/api/admin/rooms', expect.any(Object));
    expect(result).toEqual([]);
  });

  it('createRoom makes POST request', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ roomId: '123' }) });
    const result = await api.createRoom('0000', 'PRIVATE');
    expect(fetch).toHaveBeenCalledWith('/api/rooms/create', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ pin: '0000', type: 'PRIVATE' }),
    }));
    expect(result.roomId).toBe('123');
  });

  it('joinRoom makes POST request', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ roomId: '123' }) });
    const result = await api.joinRoom('0000', 'Nick', 'device1');
    expect(fetch).toHaveBeenCalledWith('/api/rooms/join', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ pin: '0000', nickname: 'Nick', deviceId: 'device1' }),
    }));
    expect(result.roomId).toBe('123');
  });

  it('getRoomInfo makes GET request', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ roomId: '123' }) });
    const result = await api.getRoomInfo('123');
    expect(fetch).toHaveBeenCalledWith('/api/rooms/123/info', expect.any(Object));
    expect(result.roomId).toBe('123');
  });

  it('uploadFile makes POST request with FormData', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ url: 'file.txt' }) });
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const result = await api.uploadFile('123', 'Nick', file);
    
    expect(fetch).toHaveBeenCalledWith('/api/rooms/123/upload', expect.objectContaining({
      method: 'POST',
      body: expect.any(FormData),
    }));
    expect(result.url).toBe('file.txt');
  });

  it('throws error when fetch response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Bad Request' }),
    });

    await expect(api.adminLogin('admin', 'wrong')).rejects.toThrow('Bad Request');
  });
  
  it('throws error with generic message when error field is absent', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(api.adminLogin('admin', 'wrong')).rejects.toThrow('Error 500');
  });
});
