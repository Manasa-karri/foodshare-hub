const socketIO = require("socket.io");
const Notification = require("./models/Notification");

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);
     /* ===== REAL-TIME NOTIFICATION ===== */
socket.on("notify", async ({ userId, title, message, type, relatedId }) => {
  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    relatedId,
  });

  io.to(userId).emit("newNotification", notification);
});

    /* ===== JOIN PERSONAL ROOM ===== */
    socket.on("join", (userId) => {
      socket.join(userId);
      socket.userId = userId;
    });

    /* ===== TYPING INDICATOR ===== */
    socket.on("typing", ({ receiverId }) => {
      socket.to(receiverId).emit("typing", {
        senderId: socket.userId,
      });
    });

    socket.on("stopTyping", ({ receiverId }) => {
      socket.to(receiverId).emit("stopTyping", {
        senderId: socket.userId,
      });
    });

    /* ===== MESSAGE DELIVERED ===== */
    socket.on("messageDelivered", ({ senderId, messageId }) => {
      socket.to(senderId).emit("messageDelivered", { messageId });
    });

    /* ===== MESSAGE READ ===== */
    socket.on("messageRead", ({ senderId, messageId }) => {
      socket.to(senderId).emit("messageRead", { messageId });
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
