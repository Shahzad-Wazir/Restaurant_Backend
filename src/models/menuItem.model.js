const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Starter", "Main Course", "Dessert", "Beverage"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    rating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
