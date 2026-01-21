const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodName: {
      type: String,
      required: true,
    },
    foodType: {
      type: String,
      enum: ["veg", "non-veg", "dairy", "bakery", "other"],
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    preparedAt: {
      type: Date,
      required: true,
    },
    expiryTime: {
      type: Number, // hours
      required: true,
    },
    freshnessScore: {
  type: Number,
  required: true,
},

    location: {
      address: String,
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ["available", "assigned", "picked", "delivered"],
      default: "available",
    },
    assignedNGO: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
