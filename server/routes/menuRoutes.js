const express = require("express");
const router = express.Router();
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const { protect, admin } = require("../middleware/auth");

router.get("/", getMenuItems);
router.get("/:id", getMenuItem);
router.post("/", protect, admin, createMenuItem);
router.put("/:id", protect, admin, updateMenuItem);
router.delete("/:id", protect, admin, deleteMenuItem);

module.exports = router;
