import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as websocket from './websocket';
import { Client } from '@stomp/stompjs';

vi.mock('@stomp/stompjs', () => {
  const Client = vi.fn();
  Client.prototype.activate = vi.fn();
  Client.prototype.deactivate = vi.fn();
  Client.prototype.subscribe = vi.fn();
  Client.prototype.publish = vi.fn();
  return { Client };
});

describe('WebSocket Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    websocket.disconnect();
  });

  it('connect returns a promise', () => {
    const promise = websocket.connect();
    promise.catch(() => {});
    expect(promise).toBeInstanceOf(Promise);
  });

  it('throws error when subscribing if not connected', () => {
    expect(() => websocket.subscribeToRoom('123', () => {})).toThrow('Not connected to WebSocket');
  });

  it('throws error when sending if not connected', () => {
    expect(() => websocket.sendMessage('123', 'nick', 'msg')).toThrow('Not connected to WebSocket');
  });

  it('disconnects successfully', () => {
    websocket.disconnect(); // Shouldn't throw even if client is null
    expect(true).toBe(true);
  });
});
