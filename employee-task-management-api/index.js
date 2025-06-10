require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;
const ownerRoutes = require("./routes/ownerRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const taskRoutes = require("./routes/taskRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  socket.on("send_message", (data) => {
    const { recipientId, message } = data;
    const recipientSocketId = connectedUsers.get(recipientId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_message", message);
    }
  });

  socket.on("task_updated", (data) => {
    const { assignedTo, task } = data;
    const recipientSocketId = connectedUsers.get(assignedTo);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("task_notification", task);
    }
  });

  socket.on("disconnect", () => {
    // Remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

app.use("/owner", ownerRoutes);
app.use("/employee", employeeRoutes);
app.use("/tasks", taskRoutes);
app.use("/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Employee Task Management API is running",
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = { app, io };
