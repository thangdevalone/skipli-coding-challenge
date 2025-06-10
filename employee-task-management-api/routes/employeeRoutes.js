const express = require("express");
const router = express.Router();
const database = require("../models/database");
const { 
  generateAccessCode, 
  isValidEmail, 
  isValidAccessCode,
  sendEmailWithAccessCode 
} = require("../utils/helpers");


router.post("/login-email", async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validation
    if (!email) {
      return res.status(400).json({ 
        error: "Email is required" 
      });
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: "Invalid email format" 
      });
    }
    
    const employee = await database.getEmployeeByEmail(email);
    if (!employee) {
      return res.status(404).json({ 
        error: "Employee not found with this email" 
      });
    }
    
    const accessCode = generateAccessCode();
    
    await database.saveEmployeeAccessCode(email, accessCode);
    
    sendEmailWithAccessCode(email, accessCode);
    
    res.json({ 
      accessCode,
      message: "Access code sent to your email address"
    });
    
  } catch (error) {
    console.error("Error sending login email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/validate-access-code", async (req, res) => {
  try {
    const { accessCode, email } = req.body;
    
    if (!accessCode || !email) {
      return res.status(400).json({ 
        error: "Access code and email are required" 
      });
    }
    
    if (!isValidAccessCode(accessCode)) {
      return res.status(400).json({ 
        error: "Invalid access code format (must be 6 digits)" 
      });
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: "Invalid email format" 
      });
    }
    
    const storedAccessCode = await database.getEmployeeAccessCode(email);
    
    if (!storedAccessCode || storedAccessCode === "") {
      return res.status(400).json({ 
        error: "No access code found for this email" 
      });
    }
    
    if (storedAccessCode !== accessCode) {
      return res.status(400).json({ 
        error: "Invalid access code" 
      });
    }
    
    await database.clearEmployeeAccessCode(email);
    
    const employee = await database.getEmployeeByEmail(email);
    
    res.json({ 
      success: true,
      message: "Access code validated successfully",
      employee: {
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        department: employee.department
      }
    });
    
  } catch (error) {
    console.error("Error validating access code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/profile", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        error: "Email is required" 
      });
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: "Invalid email format" 
      });
    }
    
    const employee = await database.getEmployeeByEmail(email);
    
    if (!employee) {
      return res.status(404).json({ 
        error: "Employee not found" 
      });
    }
    
    res.json({
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      createdAt: employee.createdAt
    });
    
  } catch (error) {
    console.error("Error getting employee profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router; 