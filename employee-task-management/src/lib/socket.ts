import { io, Socket } from 'socket.io-client';
import { Message } from './messageService';
import { Task } from './taskService';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.socket && this.socket.connected) {
      return;
    }

    this.userId = userId;
    this.socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('Connected to server');
      if (this.userId) {
        this.socket?.emit('join', this.userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  sendMessage(recipientId: string, message: Message) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('send_message', { recipientId, message });
    }
  }

  onReceiveMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  offReceiveMessage() {
    if (this.socket) {
      this.socket.off('receive_message');
    }
  }

  // Task handling
  notifyTaskUpdate(assignedTo: string, task: Task) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('task_updated', { assignedTo, task });
    }
  }

  onTaskNotification(callback: (task: Task) => void) {
    if (this.socket) {
      this.socket.on('task_notification', callback);
    }
  }

  offTaskNotification() {
    if (this.socket) {
      this.socket.off('task_notification');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

const socketService = new SocketService();
export default socketService; 