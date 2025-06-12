"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import messageService, {
  Contact,
  Conversation,
  Message,
} from "@/lib/messageService";
import socketService from "@/lib/socket";
import useAuthStore from "@/stores/useAuthStore";
import { MessageCircle, Plus, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    socketService.onReceiveMessage((message) => {
      setMessages((prev) => [...prev, message]);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchInitialData = async () => {
    try {
      await Promise.all([fetchConversations(), fetchContacts()]);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const conversationsList = await messageService.getConversations();
      setConversations(conversationsList);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const contactsList = await messageService.getContacts();
      setContacts(contactsList);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    try {
      const messagesList = await messageService.getMessages(conversation.id);
      setMessages(messagesList);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const handleStartConversation = async (contact: Contact) => {
    try {
      const conversation = await messageService.startConversation(
        contact.employeeId
      );
      setIsContactDialogOpen(false);
      await fetchConversations();

      // Find and select the new conversation
      const newConversation =
        conversations.find((c) => c.id === conversation.id) || conversation;
      handleSelectConversation(newConversation);
    } catch (error: any) {
      toast.error(error.message || "Failed to start conversation");
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
      toast.error("Invalid conversation");
      return;
    }

    setIsSending(true);
    try {
      const message = await messageService.sendMessage({
        recipientId,
        content: newMessage.trim(),
      });

      setMessages((prev) => [...prev, message]);

      socketService.sendMessage(recipientId, message);

      setNewMessage("");

      await fetchConversations();
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Dialog
                open={isContactDialogOpen}
                onOpenChange={setIsContactDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:block">New Conversation</span>
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
                                <p className="text-sm text-gray-600">
                                  {contact.email}
                                </p>
                                <span className="text-xs text-blue-600">
                                  {contact.role}
                                </span>
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
                      <p className="text-gray-500 text-center py-4">
                        No contacts available
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
                          ? "bg-blue-100 border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <User className="h-8 w-8 text-gray-400 border rounded-full p-1" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {conversation.otherParticipant?.name ||
                              "Unknown User"}
                          </p>
                          {conversation.lastMessage && (
                            <p className="text-xs text-gray-600 truncate">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                          {conversation.lastMessageAt && (
                            <p className="text-xs text-gray-500">
                              {new Date(
                                conversation.lastMessageAt
                              ).toLocaleDateString()}
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
                  <p className="text-sm">
                    Start a new conversation to get started
                  </p>
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
                  {selectedConversation.otherParticipant?.name ||
                    "Unknown User"}
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
                          className={`flex ${
                            isOwn ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwn
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
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
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t flex space-x-2"
                >
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isSending}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isSending || !newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-[500px]">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">
                  Select a conversation
                </h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
