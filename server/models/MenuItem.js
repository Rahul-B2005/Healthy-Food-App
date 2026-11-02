const mongoose = require("mongoose");

const CATEGORIES = [
  "Breakfast & Tiffin",
  "Rice",
  "Kuzhambu & Curries",
  "Non-Veg Specials",
  "Snacks",
  "Sweets",
  "Beverages",
];

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tamilName: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: CATEGORIES,
      default: "Breakfast & Tiffin",
    },
    image: { type: String, default: "" },
    calories: { type: Number, default: 0 },
    tags: [{ type: String }], // e.g. vegan, gluten-free, high-protein
    isVeg: { type: Boolean, default: true },
    spiceLevel: { type: String, enum: ["Mild", "Medium", "Spicy"], default: "Mild" },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
module.exports.CATEGORIES = CATEGORIES;
