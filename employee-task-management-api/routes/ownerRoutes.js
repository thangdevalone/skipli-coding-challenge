const express = require("express");
const router = express.Router();
const database = require("../models/database");
const { 
  generateAccessCode, 
  isValidPhoneNumber, 
  isValidAccessCode, 
  isValidEmail,
  sendSMSWithAccessCode 
} = require("../utils/helpers");


router.post("/create-access-code", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    // Validation
    if (!phoneNumber) {
      return res.status(400).json({ 
        error: "Phone number is required" 
      });
    }
    
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({ 
        error: "Invalid phone number format" 
      });
    }
    
    const accessCode = generateAccessCode();
    
    await database.saveOwnerAccessCode(phoneNumber, accessCode);
    
    sendSMSWithAccessCode(phoneNumber, accessCode);
    
    res.json({ 
      accessCode,
      message: "Access code sent to your phone number"
    });
    
  } catch (error) {
    console.error("Error creating access code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/validate-access-code", async (req, res) => {
  try {
    const { accessCode, phoneNumber } = req.body;
    
    if (!accessCode || !phoneNumber) {
      return res.status(400).json({ 
        error: "Access code and phone number are required" 
      });
    }
    
    if (!isValidAccessCode(accessCode)) {
      return res.status(400).json({ 
        error: "Invalid access code format (must be 6 digits)" 
      });
    }
    
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({ 
        error: "Invalid phone number format" 
      });
    }
    
    const storedAccessCode = await database.getOwnerAccessCode(phoneNumber);
    
    if (!storedAccessCode || storedAccessCode === "") {
      return res.status(400).json({ 
        error: "No access code found for this phone number" 
      });
    }
    
    if (storedAccessCode !== accessCode) {
      return res.status(400).json({ 
        error: "Invalid access code" 
      });
    }
    
    await database.clearOwnerAccessCode(phoneNumber);
    
    res.json({ 
      success: true,
      message: "Access code validated successfully"
    });
    
  } catch (error) {
    console.error("Error validating access code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/get-employee", async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    if (!employeeId) {
      return res.status(400).json({ 
        error: "Employee ID is required" 
      });
    }
    
    const employee = await database.getEmployee(employeeId);
    
    if (!employee) {
      return res.status(404).json({ 
        error: "Employee not found" 
      });
    }
    
    res.json(employee);
    
  } catch (error) {
    console.error("Error getting employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/create-employee", async (req, res) => {
  try {
    const { name, email, department } = req.body;
    
    if (!name || !email || !department) {
      return res.status(400).json({ 
        error: "Name, email, and department are required" 
      });
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: "Invalid email format" 
      });
    }
    
    const existingEmployee = await database.getEmployeeByEmail(email);
    if (existingEmployee) {
      return res.status(400).json({ 
        error: "Employee with this email already exists" 
      });
    }
    
    const employeeId = await database.createEmployee(name, email, department);
    
    res.json({ 
      success: true, 
      employeeId,
      message: "Employee created successfully"
    });
    
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/delete-employee", async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    // Validation
    if (!employeeId) {
      return res.status(400).json({ 
        error: "Employee ID is required" 
      });
    }
    
    const employee = await database.getEmployee(employeeId);
    if (!employee) {
      return res.status(404).json({ 
        error: "Employee not found" 
      });
    }
    
    const deleted = await database.deleteEmployee(employeeId);
    
    if (deleted) {
      res.json({ 
        success: true,
        message: "Employee deleted successfully"
      });
    } else {
      res.status(500).json({ 
        error: "Failed to delete employee" 
      });
    }
    
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/employees", async (req, res) => {
  try {
    const employees = await database.getAllEmployees();
    res.json({ employees });
  } catch (error) {
    console.error("Error getting all employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router; 