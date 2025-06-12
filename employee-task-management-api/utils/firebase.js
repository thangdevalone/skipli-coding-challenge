// Firebase Firestore database implementation
const { admin, db } = require("../config/firebase");

class Firebase {
  constructor() {
    this.COLLECTIONS = {
      ACCESS_CODES: "accessCodes",
      EMPLOYEES: "employees",
      COUNTERS: "counters",
      TASKS: "tasks",
      MESSAGES: "messages",
      CONVERSATIONS: "conversations",
    };
  }

  async saveOwnerAccessCode(phoneNumber, accessCode) {
    try {
      await db
        .collection(this.COLLECTIONS.ACCESS_CODES)
        .doc(phoneNumber)
        .set({
          accessCode,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          phoneNumber,
        });
    } catch (error) {
      console.error("Error saving owner access code:", error);
      throw error;
    }
  }

  async getOwnerAccessCode(phoneNumber) {
    try {
      const doc = await db
        .collection(this.COLLECTIONS.ACCESS_CODES)
        .doc(phoneNumber)
        .get();

      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (error) {
      console.error("Error getting owner access code:", error);
      throw error;
    }
  }

  async clearOwnerAccessCode(phoneNumber) {
    try {
      await db
        .collection(this.COLLECTIONS.ACCESS_CODES)
        .doc(phoneNumber)
        .update({
          accessCode: "",
          clearedAt: new Date().toISOString(),
        });
    } catch (error) {
      console.error("Error clearing owner access code:", error);
      throw error;
    }
  }

  async saveEmployeeAccessCode(email, accessCode) {
    try {
      await db
        .collection(this.COLLECTIONS.ACCESS_CODES)
        .doc(email)
        .set({
          code: accessCode,
          expiresAt: Date.now() + 10 * 60 * 1000,
          email,
          attempts: 0,
          createdAt: Date.now(),
        });
    } catch (error) {
      console.error("Error saving employee access code:", error);
      throw error;
    }
  }

  async getEmployeeAccessCode(email) {
    try {
      const doc = await db
        .collection(this.COLLECTIONS.ACCESS_CODES)
        .doc(email)
        .get();

      if (doc.exists) {
        return doc.data().code;
      }
      return null;
    } catch (error) {
      console.error("Error getting employee access code:", error);
      throw error;
    }
  }

  async getEmployeeAccessCodeData(email) {
    try {
      const doc = await db
        .collection(this.COLLECTIONS.ACCESS_CODES)
        .doc(email)
        .get();

      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (error) {
      console.error("Error getting employee access code data:", error);
      throw error;
    }
  }

  async clearEmployeeAccessCode(email) {
    try {
      await db.collection(this.COLLECTIONS.ACCESS_CODES).doc(email).delete();
    } catch (error) {
      console.error("Error clearing employee access code:", error);
      throw error;
    }
  }
  async confirmEmployee(email) {
    console.log("email", email);
    try {
      const snapshot = await db
        .collection(this.COLLECTIONS.EMPLOYEES)
        .where("email", "==", email)
        .get();

      if (!snapshot.empty) {
        const employeeDoc = snapshot.docs[0];
        await employeeDoc.ref.update({
          confirmed: true,
          confirmedAt: new Date().toISOString(),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error confirming employee:", error);
      throw error;
    }
  }

  async createEmployee(name, email, department) {
    try {
      const employeeId = Math.random().toString(36).substring(2, 15);

      const employee = {
        employeeId,
        name,
        email,
        department,
        role: "employee",
        confirmed: false,
        createdAt: new Date().toISOString(),
      };

      await db
        .collection(this.COLLECTIONS.EMPLOYEES)
        .doc(employeeId)
        .set(employee);

      return employeeId;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  }

  async createOwner(name, phoneNumber) {
    const employeeId = Math.random().toString(36).substring(2, 15);
    const employee = await db
      .collection(this.COLLECTIONS.EMPLOYEES)
      .where("email", "==", phoneNumber)
      .get();
    if (!employee.empty) {
      return employee.docs[0].data();
    }
    try {
      const employee = {
        employeeId,
        name,
        phoneNumber,
        role: "owner",
        createdAt: new Date().toISOString(),
      };

      await db
        .collection(this.COLLECTIONS.EMPLOYEES)
        .doc(employeeId)
        .set(employee);

      return employee;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  }
  async getOwner(email) {
    try {
      const snapshot = await db
        .collection(this.COLLECTIONS.EMPLOYEES)
        .where("email", "==", email)
        .get();

      if (snapshot.empty) {
        return null;
      }

      return snapshot.docs[0].data();
    } catch (error) {
      console.error("Error getting owner:", error);
      throw error;
    }
  }

  async getEmployee(employeeId) {
    try {
      const doc = await db
        .collection(this.COLLECTIONS.EMPLOYEES)
        .doc(employeeId)
        .get();

      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (error) {
      console.error("Error getting employee:", error);
      throw error;
    }
  }

  async deleteEmployee(employeeId) {
    try {
      await db.collection(this.COLLECTIONS.EMPLOYEES).doc(employeeId).delete();
      return true;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  }

  async getAllEmployees() {
    try {
      const snapshot = await db.collection(this.COLLECTIONS.EMPLOYEES).get();
      const employees = [];

      snapshot.forEach((doc) => {
        employees.push(doc.data());
      });

      return employees;
    } catch (error) {
      console.error("Error getting all employees:", error);
      throw error;
    }
  }

  async getEmployeeByEmail(email) {
    try {
      const snapshot = await db
        .collection(this.COLLECTIONS.EMPLOYEES)
        .where("email", "==", email)
        .get();

      if (snapshot.empty) {
        return null;
      }

      return snapshot.docs[0].data();
    } catch (error) {
      console.error("Error getting employee by email:", error);
      throw error;
    }
  }

  // Task Management Methods
  async createTask(taskData) {
    try {
      const taskId = Math.random().toString(36).substring(2, 15);
      const task = {
        id: taskId,
        ...taskData,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.collection(this.COLLECTIONS.TASKS).doc(taskId).set(task);
      return task;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }


  async createMessage(messageData) {
    try {
      const messageId = Math.random().toString(36).substring(2, 15);
      const message = {
        id: messageId,
        ...messageData,
        createdAt: new Date().toISOString(),
      };

      await db
        .collection(this.COLLECTIONS.MESSAGES)
        .doc(messageId)
        .set(message);
      return message;
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }

  async getMessagesByConversation(conversationId) {
    try {
      // Sử dụng query đơn giản để tránh vấn đề index
      const snapshot = await db
        .collection(this.COLLECTIONS.MESSAGES)
        .where("conversationId", "==", conversationId)
        .get();

      const messages = [];
      snapshot.forEach((doc) => {
        messages.push(doc.data());
      });

      // Sort trong memory theo createdAt
      messages.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeA - timeB; // Sort asc
      });

      return messages;
    } catch (error) {
      console.error("Error getting messages:", error);
      // Return empty array thay vì throw error
      return [];
    }
  }

  async getOrCreateConversation(participant1, participant2) {
    try {
      const conversationId = [participant1, participant2].sort().join("_");

      const doc = await db
        .collection(this.COLLECTIONS.CONVERSATIONS)
        .doc(conversationId)
        .get();

      if (!doc.exists) {
        const conversation = {
          id: conversationId,
          participants: [participant1, participant2],
          createdAt: new Date().toISOString(),
          lastMessage: null,
          lastMessageAt: new Date().toISOString(), // Set initial time instead of null
        };

        await db
          .collection(this.COLLECTIONS.CONVERSATIONS)
          .doc(conversationId)
          .set(conversation);
        return conversation;
      }

      return doc.data();
    } catch (error) {
      console.error("Error getting/creating conversation:", error);
      throw error;
    }
  }

  async getUserConversations(userId) {
    try {
      // Thử query đơn giản với array-contains trước
      let snapshot;
      try {
        snapshot = await db
          .collection(this.COLLECTIONS.CONVERSATIONS)
          .where("participants", "array-contains", userId)
          .get();
      } catch (indexError) {
        console.log("Index error, fallback to simple query:", indexError.message);
        // Fallback: get all conversations và filter trong memory
        snapshot = await db
          .collection(this.COLLECTIONS.CONVERSATIONS)
          .get();
      }

      const conversations = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Filter conversations that include this user if we did fallback query
        if (data.participants && data.participants.includes(userId)) {
          conversations.push(data);
        }
      });

      // Sort trong memory theo lastMessageAt
      conversations.sort((a, b) => {
        const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return timeB - timeA; // Sort desc
      });

      return conversations;
    } catch (error) {
      console.error("Error getting user conversations:", error);
      // Return empty array nếu có lỗi để tránh crash app
      return [];
    }
  }

  async updateConversationLastMessage(conversationId, message) {
    try {
      await db
        .collection(this.COLLECTIONS.CONVERSATIONS)
        .doc(conversationId)
        .update({
          lastMessage: message,
          lastMessageAt: new Date().toISOString(),
        });
      return true;
    } catch (error) {
      console.error("Error updating conversation:", error);
      throw error;
    }
  }
}

const firebase = new Firebase();

module.exports = firebase;
