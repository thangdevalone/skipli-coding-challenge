// Firebase Firestore database implementation
const { db } = require("../config/firebase");

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
          accessCode,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          email,
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
        return doc.data().accessCode;
      }
      return null;
    } catch (error) {
      console.error("Error getting employee access code:", error);
      throw error;
    }
  }

  async clearEmployeeAccessCode(email) {
    try {
      await db.collection(this.COLLECTIONS.ACCESS_CODES).doc(email).update({
        accessCode: "",
        clearedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error clearing employee access code:", error);
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

  async getTasksByEmployee(employeeId) {
    try {
      const snapshot = await db
        .collection(this.COLLECTIONS.TASKS)
        .where("assignedTo", "==", employeeId)
        .orderBy("createdAt", "desc")
        .get();

      const tasks = [];
      snapshot.forEach((doc) => {
        tasks.push(doc.data());
      });

      return tasks;
    } catch (error) {
      console.error("Error getting tasks by employee:", error);
      throw error;
    }
  }

  async getAllTasks() {
    try {
      const snapshot = await db
        .collection(this.COLLECTIONS.TASKS)
        .orderBy("createdAt", "desc")
        .get();

      const tasks = [];
      snapshot.forEach((doc) => {
        tasks.push(doc.data());
      });

      return tasks;
    } catch (error) {
      console.error("Error getting all tasks:", error);
      throw error;
    }
  }

  async updateTaskStatus(taskId, status) {
    try {
      await db.collection(this.COLLECTIONS.TASKS).doc(taskId).update({
        status,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  }

  async getTask(taskId) {
    try {
      const doc = await db.collection(this.COLLECTIONS.TASKS).doc(taskId).get();
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (error) {
      console.error("Error getting task:", error);
      throw error;
    }
  }

  async deleteTask(taskId) {
    try {
      await db.collection(this.COLLECTIONS.TASKS).doc(taskId).delete();
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  // Messaging Methods
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
      const snapshot = await db
        .collection(this.COLLECTIONS.MESSAGES)
        .where("conversationId", "==", conversationId)
        .orderBy("createdAt", "asc")
        .get();

      const messages = [];
      snapshot.forEach((doc) => {
        messages.push(doc.data());
      });

      return messages;
    } catch (error) {
      console.error("Error getting messages:", error);
      throw error;
    }
  }

  async getOrCreateConversation(participant1, participant2) {
    try {
      // Create a consistent conversation ID
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
          lastMessageAt: null,
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
      const snapshot = await db
        .collection(this.COLLECTIONS.CONVERSATIONS)
        .where("participants", "array-contains", userId)
        .orderBy("lastMessageAt", "desc")
        .get();

      const conversations = [];
      snapshot.forEach((doc) => {
        conversations.push(doc.data());
      });

      return conversations;
    } catch (error) {
      console.error("Error getting user conversations:", error);
      throw error;
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
