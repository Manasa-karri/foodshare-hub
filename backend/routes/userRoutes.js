const express = require("express");
const router = express.Router();
const { updateUser, deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.put("/update", protect, updateUser);
router.delete("/delete", protect, deleteUser);

module.exports = router;
