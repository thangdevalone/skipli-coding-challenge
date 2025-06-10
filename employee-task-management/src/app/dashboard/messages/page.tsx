'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Send, MessageCircle, User } from 'lucide-react';
import messageService, { Message, Conversation, Contact } from '@/lib/messageService';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import socketService from '@/lib/socket';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    // Listen for real-time messages
    socketService.onReceiveMessage((message) => {
      setMessages(prev => [...prev, message]);
      // Update conversations list
      fetchConversations();
      scrollToBottom();
    });

    return () => {
      socketService.offReceiveMessage();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchInitialData = async () => {
    try {
      // Get current user
      const userResponse = await api.get('/owner/user-info');
      setUser(userResponse.data.user);

      // Fetch conversations and contacts
      await Promise.all([
        fetchConversations(),
        fetchContacts(),
      ]);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const conversationsList = await messageService.getConversations();
      setConversations(conversationsList);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const contactsList = await messageService.getContacts();
      setContacts(contactsList);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    try {
      const messagesList = await messageService.getMessages(conversation.id);
      setMessages(messagesList);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    }
  };

  const handleStartConversation = async (contact: Contact) => {
    try {
      const conversation = await messageService.startConversation(contact.employeeId);
      setIsContactDialogOpen(false);
      await fetchConversations();
      
      // Find and select the new conversation
      const newConversation = conversations.find(c => c.id === conversation.id) || conversation;
      handleSelectConversation(newConversation);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation || !user) {
      return;
    }

    const recipientId = selectedConversation.participants.find(
      (id) => id !== user.employeeId
    );

    if (!recipientId) {
      toast({
        title: 'Error',
        description: 'Invalid conversation',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      const message = await messageService.sendMessage({
        recipientId,
        content: newMessage.trim(),
      });

      // Add message to local state
      setMessages(prev => [...prev, message]);
      
      // Send real-time notification
      socketService.sendMessage(recipientId, message);
      
      setNewMessage('');
      
      // Update conversations list
      await fetchConversations();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Communicate with your team members in real-time
          </p>
        </div>

        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Conversation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {contacts.length > 0 ? (
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div
                      key={contact.employeeId}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <User className="h-8 w-8 text-gray-400 border rounded-full p-1" />
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                          <span className="text-xs text-blue-600">{contact.role}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleStartConversation(contact)}
                      >
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No contacts available</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Messages Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {conversations.length > 0 ? (
                <div className="space-y-1 p-4">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? 'bg-blue-100 border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <User className="h-8 w-8 text-gray-400 border rounded-full p-1" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {conversation.otherParticipant?.name || 'Unknown User'}
                          </p>
                          {conversation.lastMessage && (
                            <p className="text-xs text-gray-600 truncate">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                          {conversation.lastMessageAt && (
                            <p className="text-xs text-gray-500">
                              {new Date(conversation.lastMessageAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start a new conversation to get started</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <CardTitle className="text-lg flex items-center">
                  <User className="h-6 w-6 mr-2 text-gray-400" />
                  {selectedConversation.otherParticipant?.name || 'Unknown User'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[500px]">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.senderId === user?.employeeId;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwn
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isSending}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isSending || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-[500px]">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
} 