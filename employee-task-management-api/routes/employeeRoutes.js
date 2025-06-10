const express = require("express");
const router = express.Router();
const firebaseService = require("../utils/firebase");
const notificationService = require("../utils/notificationService");

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

    const accessCode = await firebaseService.getEmployeeAccessCode(email);

    await notificationService.sendEmail(email, accessCode);

    res.json({
      message: "Access code sent to your email address",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
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

    const emailKey = email.toLowerCase();
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

    if (storedData.attempts >= 10) {
      await firebaseService.clearEmployeeAccessCode(email);
      return res.status(400).json({
        error: "Too many failed attempts. Please request a new code.",
      });
    }

    if (storedData.code !== accessCode) {
      storedData.attempts++;
      return res.status(400).json({
        error: "Invalid access code",
      });
    }

    await firebaseService.clearEmployeeAccessCode(email);

    res.json({
      success: true,
      message: "Access code validated successfully",
    });
  } catch (error) {
    console.error("Error validating access code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
