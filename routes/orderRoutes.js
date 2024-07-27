const express = require("express");
const {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);
router.get("/:id", getOrderById);
router.get("/", getAllOrders);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
