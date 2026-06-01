import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

let stompClient = null;
let connectPromise = null;
let connectResolve = null;
let connectReject = null;

export function connect() {
  if (stompClient && stompClient.connected) {
    return Promise.resolve(stompClient);
  }
  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = new Promise((resolve, reject) => {
    connectResolve = resolve;
    connectReject = reject;

    stompClient = new Client({
      webSocketFactory: () => new SockJS('/ws/chat'),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        connectPromise = null;
        resolve(stompClient);
      },
      onStompError: (frame) => {
        connectPromise = null;
        reject(new Error(frame.headers?.message || 'STOMP error'));
      },
      onWebSocketError: (error) => {
        connectPromise = null;
        reject(error);
      },
    });

    stompClient.activate();
  });

  return connectPromise;
}

/**
 * Subscribe to messages from a specific room.
 * Returns the subscription object (call .unsubscribe() to stop).
 */
export function subscribeToRoom(roomId, callback) {
  if (!stompClient || !stompClient.connected) {
    throw new Error('Not connected to WebSocket');
  }

  return stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
    const body = JSON.parse(message.body);
    callback(body);
  });
}

/**
 * Send a message to a room.
 */
export function sendMessage(roomId, nickname, message) {
  if (!stompClient || !stompClient.connected) {
    throw new Error('Not connected to WebSocket');
  }

  stompClient.publish({
    destination: `/app/chat/${roomId}`,
    body: JSON.stringify({ nickname, message }),
  });
}

/**
 * Disconnect from the STOMP broker.
 */
export function disconnect() {
  if (connectReject) {
    connectReject(new Error('Connection cancelled'));
    connectReject = null;
    connectResolve = null;
    connectPromise = null;
  }
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}
