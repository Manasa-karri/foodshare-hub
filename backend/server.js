const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const foodRequestRoutes = require("./routes/foodRequestRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Socket
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);

/* ================= DATABASE ================= */
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("Smart Food Management Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-request", foodRequestRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

/* ================= SOCKET.IO ================= */
// 🔥 Initialize socket AFTER routes
initSocket(server);

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
