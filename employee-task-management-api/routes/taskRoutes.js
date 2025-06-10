const express = require("express");
const router = express.Router();
const firebaseService = require("../utils/firebase");
const { authenticateToken } = require("../utils/jwtAuth");

// Create task (Owner only)
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { title, description, assignedTo, priority = "medium", dueDate } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({
        error: "Title and assignedTo are required",
      });
    }

    // Verify employee exists
    const employee = await firebaseService.getEmployee(assignedTo);
    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const taskData = {
      title,
      description,
      assignedTo,
      createdBy: req.user.employeeId,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    const task = await firebaseService.createTask(taskData);

    res.json({
      success: true,
      task,
      message: "Task created successfully",
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all tasks (Owner only)
router.get("/all", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        error: "Access denied. Owner role required.",
      });
    }

    const tasks = await firebaseService.getAllTasks();
    res.json({ tasks });
  } catch (error) {
    console.error("Error getting all tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get tasks for current user
router.get("/my-tasks", authenticateToken, async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === "owner") {
      // Owner sees all tasks
      tasks = await firebaseService.getAllTasks();
    } else {
      // Employee sees only their tasks
      tasks = await firebaseService.getTasksByEmployee(req.user.employeeId);
    }

    res.json({ tasks });
  } catch (error) {
    console.error("Error getting user tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update task status
router.patch("/:taskId/status", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: "Status is required",
      });
    }

    const validStatuses = ["pending", "in-progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    // Verify task exists
    const task = await firebaseService.getTask(taskId);
    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    // Check permissions
    if (req.user.role !== "owner" && task.assignedTo !== req.user.employeeId) {
      return res.status(403).json({
        error: "Access denied. You can only update your own tasks.",
      });
    }

    await firebaseService.updateTaskStatus(taskId, status);

    res.json({
      success: true,
      message: "Task status updated successfully",
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single task
router.get("/:taskId", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await firebaseService.getTask(taskId);

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    // Check permissions
    if (req.user.role !== "owner" && task.assignedTo !== req.user.employeeId) {
      return res.status(403).json({
        error: "Access denied.",
      });
    }

    res.json({ task });
  } catch (error) {
    console.error("Error getting task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete task (Owner only)
router.delete("/:taskId", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        error: "Access denied. Owner role required.",
      });
    }

    const { taskId } = req.params;
    const task = await firebaseService.getTask(taskId);

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    await firebaseService.deleteTask(taskId);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router; 