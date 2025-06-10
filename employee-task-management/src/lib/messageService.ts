import api from './api';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  readBy: string[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  otherParticipant?: {
    employeeId: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    role: string;
  };
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  lastMessageAt?: string;
  createdAt: string;
}

export interface Contact {
  employeeId: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: string;
}

export interface SendMessageData {
  recipientId: string;
  content: string;
}

class MessageService {
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await api.get('/messages/conversations');
      return response.data.conversations;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch conversations');
    }
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await api.get(`/messages/conversations/${conversationId}`);
      return response.data.messages;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch messages');
    }
  }

  async sendMessage(data: SendMessageData): Promise<Message> {
    try {
      const response = await api.post('/messages/send', data);
      return response.data.message;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to send message');
    }
  }

  async startConversation(participantId: string): Promise<Conversation> {
    try {
      const response = await api.post('/messages/conversations/start', {
        participantId,
      });
      return response.data.conversation;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to start conversation');
    }
  }

  async getContacts(): Promise<Contact[]> {
    try {
      const response = await api.get('/messages/contacts');
      return response.data.contacts;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch contacts');
    }
  }
}

const messageService = new MessageService();
export default messageService; 