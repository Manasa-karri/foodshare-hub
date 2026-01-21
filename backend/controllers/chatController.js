const Message = require("../models/Message");
const Notification = require("../models/Notification");
const { getIO } = require("../socket");

/* ================= SEND MESSAGE (REAL-TIME) ================= */
exports.sendMessageTest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    // 1️⃣ Save message
    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message,
      status: "sent",
    });

    const io = getIO();

    // 2️⃣ Send message in real-time
    io.to(receiverId.toString()).emit("newMessage", newMessage);

    // 3️⃣ Mark as delivered
    await Message.findByIdAndUpdate(newMessage._id, {
      status: "delivered",
    });

    io.to(req.user._id.toString()).emit("messageDelivered", {
      messageId: newMessage._id,
    });

    // 4️⃣ Create notification
    const notification = await Notification.create({
      user: receiverId,
      title: "New Message",
      message: "You received a new message",
      type: "chat",
    });

    io.to(receiverId.toString()).emit("newNotification", notification);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET CHAT HISTORY ================= */
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= MARK MESSAGES AS READ ================= */
exports.markAsRead = async (req, res) => {
  try {
    const { senderId } = req.body;

    await Message.updateMany(
      {
        sender: senderId,
        receiver: req.user._id,
        status: { $ne: "read" },
      },
      { status: "read" }
    );

    const io = getIO();

    io.to(senderId.toString()).emit("messageRead", {
      readerId: req.user._id,
    });

    res.status(200).json({
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET UNREAD COUNT ================= */
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      status: { $ne: "read" },
    });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
