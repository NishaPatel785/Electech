import db from "../config/db.js";

// ✅ Get logged-in user's orders
export const getUserOrders = (req, res) => {
  const user_id = req.user.id;

  const orderQuery = `
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
  `;

  db.query(orderQuery, [user_id], (err, orders) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (orders.length === 0) {
      return res.status(200).json({ success: true, orders: [] });
    }

    // Get all items for each order
    const orderIds = orders.map((o) => o.id);
    const itemsQuery = `
      SELECT * FROM order_items WHERE order_id IN (?)
    `;

    db.query(itemsQuery, [orderIds], (err, items) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      const groupedOrders = orders.map(order => {
        return {
          ...order,
          items: items.filter(i => i.order_id === order.id),
        };
      });

      res.status(200).json({ success: true, orders: groupedOrders });
    });
  });
};

// ✅ Admin: Get all orders
export const getAllOrders = (req, res) => {
  const orderQuery = `
    SELECT o.*, u.id as user_id FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;

  db.query(orderQuery, (err, orders) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (orders.length === 0) {
      return res.status(200).json({ success: true, orders: [] });
    }

    const orderIds = orders.map((o) => o.id);
    const itemsQuery = `
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id IN (?)
    `;

    db.query(itemsQuery, [orderIds], (err, items) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      const groupedOrders = orders.map(order => ({
        ...order,
        items: items.filter(i => i.order_id === order.id),
      }));

      res.status(200).json({ success: true, orders: groupedOrders });
    });
  });
};


// ✅ Admin: Update delivery status
export const updateDeliveryStatus = (req, res) => {
  const { order_id } = req.params;
  const { delivery_status } = req.body;

  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(delivery_status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  db.query(
    "UPDATE orders SET delivery_status = ? WHERE id = ?",
    [delivery_status, order_id],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      res.status(200).json({ success: true, message: "Status updated" });
    }
  );
};
