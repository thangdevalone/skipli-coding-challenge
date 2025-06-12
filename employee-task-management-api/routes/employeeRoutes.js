const express = require("express");
const router = express.Router();
const firebaseService = require("../utils/firebase");
const notificationService = require("../utils/notificationService");
const { generateToken } = require("../utils/jwtAuth");

router.post("/login-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const existingEmployee = await firebaseService.getEmployeeByEmail(email);

    if (!existingEmployee) {
      return res.status(404).json({
        error: "Employee not found with this email",
      });
    }

    if (!existingEmployee.confirmed) {
      return res.status(400).json({
        error: "Please confirm your account first. Check your email for confirmation link.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await firebaseService.saveEmployeeAccessCode(email, otp);

    await notificationService.sendEmployeeOTP(email, otp);

    res.json({
      message: "OTP sent to your email address",
    });
  } catch (error) {
    console.error("Error in login-email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/confirm-employee", async (req, res) => {
  try {
    const { email } = req.body;

    const confirmedEmployee = await firebaseService.confirmEmployee(email);

    if (!confirmedEmployee) {
      return res.status(404).json({
        error: "Employee not found with this email",
      });
    }

    res.json({
      success: true,
      message: "Employee confirmed successfully",
    });


  } catch (error) {
    console.error("Error in confirm-account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/validate-access-code", async (req, res) => {
  try {
    const { accessCode, email } = req.body;

    if (!accessCode || !email) {
      return res.status(400).json({
        error: "Access code and email are required",
      });
    }

    const storedData = await firebaseService.getEmployeeAccessCode(email);

    if (!storedData) {
      return res.status(400).json({
        error: "No access code found for this email",
      });
    }

    if (Date.now() > storedData.expiresAt) {
      await firebaseService.clearEmployeeAccessCode(email);
      return res.status(400).json({
        error: "Access code has expired. Please request a new code.",
      });
    }

    await firebaseService.clearEmployeeAccessCode(email);
    let employee;
    const existingEmployee = await firebaseService.getEmployeeByEmail(email);

    if (!existingEmployee) {
      employee = await firebaseService.createEmployee(email);
    } else {
      employee = existingEmployee;
    }

    const token = generateToken(employee);

    res.json({
      data: {
        token,
        user: employee,
      },
      success: true,
      message: "Access code validated successfully",
    });
  } catch (error) {
    console.error("Error validating access code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
