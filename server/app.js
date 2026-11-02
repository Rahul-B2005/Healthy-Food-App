require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "healthy-food-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// 404 + error handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

const server = http.createServer(app);

// Socket.io powers live order-tracking updates (see VineStepper in the UI)
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "*" },
});

io.on("connection", (socket) => {
  // Client joins a room for the specific order it wants to track
  socket.on("joinOrderRoom", (orderId) => {
    socket.join(`order_${orderId}`);
  });
  socket.on("leaveOrderRoom", (orderId) => {
    socket.leave(`order_${orderId}`);
  });
});

// Make io available to controllers via req.app.get("io")
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Healthy Food API running on port ${PORT}`));
