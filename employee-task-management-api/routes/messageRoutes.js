const express = require("express");
const router = express.Router();
const firebaseService = require("../utils/firebase");
const { authenticateToken } = require("../utils/jwtAuth");

// Get all conversations for current user
router.get("/conversations", authenticateToken, async (req, res) => {
  try {
    const conversations = await firebaseService.getUserConversations(req.user.employeeId);
    
    // Get participant details for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const otherParticipantId = conversation.participants.find(
          (id) => id !== req.user.employeeId
        );
        
        let otherParticipant = null;
        if (otherParticipantId) {
          otherParticipant = await firebaseService.getEmployee(otherParticipantId);
        }
        
        return {
          ...conversation,
          otherParticipant,
        };
      })
    );

    res.json({ conversations: conversationsWithDetails });
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get messages for a specific conversation
router.get("/conversations/:conversationId", authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Verify user is participant in this conversation
    const [participant1, participant2] = conversationId.split('_');
    if (participant1 !== req.user.employeeId && participant2 !== req.user.employeeId) {
      return res.status(403).json({
        error: "Access denied. You are not a participant in this conversation.",
      });
    }

    const messages = await firebaseService.getMessagesByConversation(conversationId);
    res.json({ messages });
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send a message
router.post("/send", authenticateToken, async (req, res) => {
  try {
    const { recipientId, content } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({
        error: "Recipient ID and content are required",
      });
    }

    // Verify recipient exists
    const recipient = await firebaseService.getEmployee(recipientId);
    if (!recipient) {
      return res.status(404).json({
        error: "Recipient not found",
      });
    }

    // Get or create conversation
    const conversation = await firebaseService.getOrCreateConversation(
      req.user.employeeId,
      recipientId
    );

    // Create message
    const messageData = {
      conversationId: conversation.id,
      senderId: req.user.employeeId,
      recipientId,
      content,
      readBy: [req.user.employeeId], // Sender has read it by default
    };

    const message = await firebaseService.createMessage(messageData);

    // Update conversation with last message
    await firebaseService.updateConversationLastMessage(conversation.id, {
      content: content,
      senderId: req.user.employeeId,
      createdAt: message.createdAt,
    });

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start a new conversation
router.post("/conversations/start", authenticateToken, async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({
        error: "Participant ID is required",
      });
    }

    // Verify participant exists
    const participant = await firebaseService.getEmployee(participantId);
    if (!participant) {
      return res.status(404).json({
        error: "Participant not found",
      });
    }

    const conversation = await firebaseService.getOrCreateConversation(
      req.user.employeeId,
      participantId
    );

    res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error starting conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get list of employees to start conversation with
router.get("/contacts", authenticateToken, async (req, res) => {
  try {
    const allEmployees = await firebaseService.getAllEmployees();
    
    // Filter out current user
    const contacts = allEmployees.filter(
      (employee) => employee.employeeId !== req.user.employeeId
    );

    res.json({ contacts });
  } catch (error) {
    console.error("Error getting contacts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router; 