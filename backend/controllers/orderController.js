import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    if (!items || !items.length) {
      return res
        .status(400)
        .json({ error: "Order must contain at least one item." });
    }
    if (!totalPrice || totalPrice < 0) {
      return res
        .status(400)
        .json({ error: "Total price must be provided and non-negative." });
    }

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product with ID ${item.product} does not exist.` });
      }
      if (!item.quantity || item.quantity < 1) {
        return res
          .status(400)
          .json({ error: "Each item must have a quantity of at least 1." });
      }
      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${product.name}". Available: ${product.countInStock}.`,
        });
      }
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice,
      createdAt: new Date(),
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.quantity },
      });
    }

    res.status(201).json({ message: "Order created successfully.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("user", "username email")
      .populate("items.product", "name price slug");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("user", "username email")
      .populate("items.product", "name price slug");

    if (!order) return res.status(404).json({ error: "Order not found." });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
