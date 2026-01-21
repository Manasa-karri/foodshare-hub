const express = require("express");
const router = express.Router();

const {
  sendMessageTest,
  getChatHistory,
  markAsRead,
  getUnreadCount,
} = require("../controllers/chatController");

const { protect } = require("../middleware/authMiddleware");

router.post("/send", protect, sendMessageTest);
router.get("/:userId", protect, getChatHistory);
router.put("/read", protect, markAsRead);
router.get("/unread/count", protect, getUnreadCount);

module.exports = router;
