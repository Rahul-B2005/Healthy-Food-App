const Order = require("../models/Order");
const { ORDER_STATUSES } = require("../models/Order");

const DELIVERY_FEE = 20.00;

// @desc  Place a new order
// @route POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const itemsPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalPrice = itemsPrice + DELIVERY_FEE;

    const order = await Order.create({
      user: req.user._id,
      items,
      itemsPrice,
      deliveryFee: DELIVERY_FEE,
      totalPrice,
      deliveryAddress,
      // This store only accepts Cash on Delivery — ignore any other value the client sends.
      paymentMethod: "Cash on Delivery",
      status: "Placed",
      estimatedDeliveryTime: new Date(Date.now() + 40 * 60 * 1000), // +40 mins
    });

    const io = req.app.get("io");
    if (io) io.emit("orderCreated", { orderId: order._id });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get logged-in user's orders
// @route GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single order (owner or staff)
// @route GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isStaff = req.user.role === "admin" || req.user.role === "delivery";
    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all orders (admin/delivery)
// @route GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update order status (admin/delivery) - drives live tracking
// @route PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note, deliveryPerson } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.statusHistory.push({ status, note, changedAt: new Date() });
    if (deliveryPerson) order.deliveryPerson = deliveryPerson;

    const updated = await order.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`order_${order._id}`).emit("orderStatusUpdated", {
        orderId: order._id,
        status: updated.status,
        statusHistory: updated.statusHistory,
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Cancel order (owner, only if still Placed/Confirmed)
// @route PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!["Placed", "Confirmed"].includes(order.status)) {
      return res.status(400).json({ message: "Order can no longer be cancelled" });
    }

    order.status = "Cancelled";
    order.statusHistory.push({ status: "Cancelled", changedAt: new Date() });
    const updated = await order.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`order_${order._id}`).emit("orderStatusUpdated", {
        orderId: order._id,
        status: updated.status,
        statusHistory: updated.statusHistory,
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
