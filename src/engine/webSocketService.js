// WebSocket Client Service for Spring Boot Backend integration
import { Client } from '@stomp/stompjs';

class BackendWebSocketService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.subscribers = new Set();
    this.statusListeners = new Set();
    this.serverUrl = 'ws://localhost:8080/ws-warehouse';
    this.connectionMode = 'LOCAL'; // 'LOCAL' or 'SPRING_BOOT'
  }

  setMode(mode) {
    this.connectionMode = mode;
    this.notifyStatus();
    if (mode === 'SPRING_BOOT' && !this.isConnected) {
      this.connect();
    } else if (mode === 'LOCAL' && this.isConnected) {
      this.disconnect();
    }
  }

  connect() {
    if (this.client) {
      this.client.deactivate();
    }

    try {
      this.client = new Client({
        brokerURL: this.serverUrl,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          this.isConnected = true;
          this.notifyStatus();
          console.log('Connected to Spring Boot Warehouse WebSocket');

          // Subscribe to warehouse updates topic
          this.client.subscribe('/topic/warehouse-updates', (message) => {
            try {
              const payload = JSON.parse(message.body);
              this.subscribers.forEach(cb => cb(payload));
            } catch (e) {
              console.error('Error parsing backend message:', e);
            }
          });
        },
        onDisconnect: () => {
          this.isConnected = false;
          this.notifyStatus();
        },
        onStompError: (frame) => {
          console.warn('STOMP broker error:', frame.headers['message']);
          this.isConnected = false;
          this.notifyStatus();
        },
        onWebSocketError: () => {
          this.isConnected = false;
          this.notifyStatus();
        }
      });

      this.client.activate();
    } catch (err) {
      console.warn('Backend WebSocket unavailable, keeping local kernel active:', err.message);
      this.isConnected = false;
      this.notifyStatus();
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.isConnected = false;
      this.notifyStatus();
    }
  }

  sendAction(action, payload = {}) {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: `/app/warehouse/${action}`,
        body: JSON.stringify(payload)
      });
      return true;
    }
    return false;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  onStatusChange(callback) {
    this.statusListeners.add(callback);
    callback({ isConnected: this.isConnected, mode: this.connectionMode });
    return () => this.statusListeners.delete(callback);
  }

  notifyStatus() {
    this.statusListeners.forEach(cb =>
      cb({ isConnected: this.isConnected, mode: this.connectionMode })
    );
  }
}

export const backendWs = new BackendWebSocketService();
