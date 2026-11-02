const mongoose = require("mongoose");

const ORDER_STATUSES = [
  "Placed",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    changedAt: { type: Date, default: Date.now },
    note: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    itemsPrice: { type: Number, required: true },
    deliveryFee: { type: Number, default: 2.99 },
    totalPrice: { type: Number, required: true },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
    },
    paymentMethod: { type: String, enum: ["Cash on Delivery"], default: "Cash on Delivery" },
    status: { type: String, enum: ORDER_STATUSES, default: "Placed" },
    statusHistory: [statusHistorySchema],
    estimatedDeliveryTime: Date,
    deliveryPerson: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (this.isNew) {
    this.statusHistory.push({ status: this.status, changedAt: new Date() });
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
