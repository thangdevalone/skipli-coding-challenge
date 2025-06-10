// Firebase Firestore database implementation
const { db } = require("../config/firebase");

class Firebase {
  constructor() {
    this.COLLECTIONS = {
      ACCESS_CODES: "accessCodes",
      EMPLOYEES: "employees",
      COUNTERS: "counters",
    };
  }

  async saveOwnerAccessCode(phoneNumber, accessCode) {
    try {
      await db.collection(this.COLLECTIONS.ACCESS_CODES).doc(phoneNumber).set({
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
      await db.collection(this.COLLECTIONS.ACCESS_CODES).doc(email).set({
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
}

const firebase = new Firebase();

module.exports = firebase;
