const Order = require("../models/Order");
const logger = require("../utils/logger");

exports.createOrder = async (req, res) => {
  try {
    const { user, products, totalAmount } = req.body;
    const newOrder = new Order({ user, products, totalAmount });
    await newOrder.save();
    logger.info(`Order created: ${newOrder._id}`);
    res.status(201).json(newOrder);
  } catch (error) {
    logger.error(`Order creation failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("products.product");
    if (!order) {
      logger.warn(`Get order failed - order not found: ${req.params.id}`);
      return res.status(404).json({ error: "Order not found" });
    }
    logger.info(`Order retrieved: ${order._id}`);
    res.status(200).json(order);
  } catch (error) {
    logger.error(`Get order failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.product");
    logger.info(`All orders retrieved, count: ${orders.length}`);
    res.status(200).json(orders);
  } catch (error) {
    logger.error(`Get all orders failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      logger.warn(`Update order failed - order not found: ${req.params.id}`);
      return res.status(404).json({ error: "Order not found" });
    }

    if (status) order.status = status;

    await order.save();
    logger.info(`Order updated: ${order._id}`);
    res.status(200).json(order);
  } catch (error) {
    logger.error(`Update order failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      logger.warn(`Delete order failed - order not found: ${req.params.id}`);
      return res.status(404).json({ error: "Order not found" });
    }
    logger.info(`Order deleted: ${order._id}`);
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    logger.error(`Delete order failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
