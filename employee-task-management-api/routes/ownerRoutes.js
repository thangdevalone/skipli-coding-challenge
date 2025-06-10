const express = require("express");
const router = express.Router();
const firebaseService = require("../utils/firebase");
const notificationService = require("../utils/notificationService");
const { generateToken } = require("../utils/jwtAuth");

router.post("/create-access-code", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        error: "Phone number is required",
      });
    }

    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

    await firebaseService.saveOwnerAccessCode(phoneNumber, accessCode);

    await notificationService.sendSMS(phoneNumber, accessCode);

    res.json({
      message: "Access code sent to your phone number",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/validate-access-code", async (req, res) => {
  try {
    const { accessCode, phoneNumber } = req.body;

    if (!accessCode || !phoneNumber) {
      return res.status(400).json({
        error: "Access code and phone number are required",
      });
    }

    const storedData = await firebaseService.getOwnerAccessCode(phoneNumber);

    if (!storedData) {
      return res.status(400).json({
        error: "No access code found for this phone number",
      });
    }

    if (Date.now() > new Date(storedData.expiresAt).getTime()) {
      await firebaseService.clearOwnerAccessCode(phoneNumber);
      return res.status(400).json({
        error: "Access code has expired. Please request a new code.",
      });
    }

    if (storedData.accessCode !== accessCode) {
      return res.status(400).json({
        error: "Invalid access code",
      });
    }

    await firebaseService.clearOwnerAccessCode(phoneNumber);
    const owner = await firebaseService.createOwner(
      "Owner - " + phoneNumber,
      phoneNumber
    );

    const token = generateToken(owner);

    res.json({
      data: {
        token,
        user: owner,
      },
      success: true,
      message: "Access code validated successfully",
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
        error: "Employee ID is required",
      });
    }

    const employee = await firebaseService.getEmployee(employeeId);

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
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
        error: "Name, email, and department are required",
      });
    }

    const existingEmployee = await firebaseService.getEmployeeByEmail(email);

    if (existingEmployee) {
      return res.status(400).json({
        error: "Employee with this email already exists",
      });
    }

    const employeeId = await firebaseService.createEmployee(name, email);

    res.json({
      success: true,
      employeeId,
      message: "Employee created successfully",
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/delete-employee", async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        error: "Employee ID is required",
      });
    }

    const employee = await firebaseService.getEmployee(employeeId);
    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    await firebaseService.deleteEmployee(employeeId);

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /owner/get-all-employees
router.get("/get-all-employees", async (req, res) => {
  try {
    const employees = await firebaseService.getAllEmployees();
    res.json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error("Error getting all employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
