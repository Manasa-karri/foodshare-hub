const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* ================= UPDATE USER ================= */
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, password, location } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (location) user.location = location;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: "User details updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE USER ================= */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
