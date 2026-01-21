const mongoose = require("mongoose");

const foodRequestSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quantityRequired: {
      type: String,
      required: true,
    },

    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    location: {
      address: String,
      latitude: Number,
      longitude: Number,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "fulfilled"],
      default: "pending",
    },

    assignedNGO: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    allocatedFood: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodRequest", foodRequestSchema);
