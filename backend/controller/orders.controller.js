import db from "../config/db.js";

export const payNow = (req, res) => {
    const user_id = req.user.id;
    const { address, payment_method, from_cart } = req.body; // from_cart condition included
  
    if (!address || !payment_method) {
      return res.status(400).json({ success: false, message: "Address and Payment Method are required" });
    }
  
    // Get Checkout Items Based on from_cart Condition
    let checkoutSql = `
    
      SELECT c.id, c.product_id, c.variant_id, p.name AS product_name, 
             v.price, c.quantity, (v.price * c.quantity) AS subtotal, c.cart_id
      FROM checkout c
      JOIN product_variants v ON c.variant_id = v.id
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;
  
    const params = [user_id];
  
    if (from_cart === true) {
      checkoutSql += ` AND c.cart_id IS NOT NULL`; // Process only cart items
    } else {
      checkoutSql += ` AND c.cart_id IS NULL`; // Process only direct checkout items
    }
  
    db.query(checkoutSql, params, (err, checkoutItems) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
  
      if (checkoutItems.length === 0) {
        return res.status(400).json({ success: false, message: "No items in checkout" });
      }
  
      // Calculate total amount
      const total_amount = checkoutItems.reduce((sum, item) => sum + item.subtotal, 0);
  
      // Insert Order into `orders` table
      const orderSql = `INSERT INTO orders (user_id, total_amount, address, payment_method, status) VALUES (?, ?, ?, ?, 'Pending')`;
  
      db.query(orderSql, [user_id, total_amount, address, payment_method], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
  
        const order_id = result.insertId; // Get the new order ID
  
        // Insert Order Items
        const orderItemsSql = `INSERT INTO order_items (order_id, product_id, variant_id, quantity, price) VALUES ?`;
  
        const orderItemsValues = checkoutItems.map(item => [order_id, item.product_id, item.variant_id, item.quantity, item.price]);
  
        db.query(orderItemsSql, [orderItemsValues], (err) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
  
          // Clear Checkout for the Selected Items
          const clearCheckoutSql = `DELETE FROM checkout WHERE user_id = ? AND (cart_id IS NOT NULL AND ? = true OR cart_id IS NULL AND ? = false)`;
  
          db.query(clearCheckoutSql, [user_id, from_cart, from_cart], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
  
            return res.status(200).json({ success: true, message: "Order placed successfully", order_id });
          });
        });
      });
    });
  };
  

 export const getOrders = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT 
      o.id AS order_id,
      o.address,
      o.status AS payment_status,
      o.created_at,
      oi.product_id,
      p.name AS product_name,
      oi.variant_id,
      v.price,
      oi.quantity,
      (v.price * oi.quantity) AS item_total,
      v.color_name,
      v.ram,
      v.size,
      v.color_code AS variant_code,
      
      -- Get the latest product status for the entire order, not per item
      ois.status AS product_status,
      ois.updated_at AS product_status_updated

    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    JOIN product_variants v ON oi.variant_id = v.id

    LEFT JOIN order_status ois ON ois.order_id = o.id -- One status per order

    WHERE oi.user_id = ?
    ORDER BY o.created_at DESC;
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    // Grouping results by `order_id` and ensure product_status is placed once outside the items
    const orders = results.reduce((acc, item) => {
      const {
        order_id,
        address,
        payment_status,
        created_at,
        product_status,
        product_status_updated,
        item_total,
        ...product
      } = item;

      // If this is the first time we've encountered this order_id
      if (!acc[order_id]) {
        acc[order_id] = {
          order_id,
          address,
          payment_status,  // Show payment status once per order
          created_at,
          product_status,  // Show product status once for the order
          product_status_updated,  // Show product status updated time
          total_amount: 0,  // To calculate total amount
          items: []  // All items will be grouped here
        };
      }

      // Push individual product details into the items array
      acc[order_id].items.push(product);

      // Accumulate total amount for the order
      acc[order_id].total_amount += item_total;

      return acc;
    }, {});

    return res.status(200).json({ success: true, orders: Object.values(orders) });
  });
};

  

export const getAllUserOrders = (req, res) => {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.user_id,
      o.address,
      o.status as status,
      o.created_at,
      ois.status AS product_status,
      ois.updated_at AS product_status_updated,
      oi.product_id,
      p.name AS product_name,
      oi.variant_id,
      v.price,
      oi.quantity,
      (v.price * oi.quantity) AS item_total,
      v.color_name,
      v.ram,
      v.size,
      v.color_code AS variant_code
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    JOIN product_variants v ON oi.variant_id = v.id
    LEFT JOIN order_status ois ON ois.order_id = o.id
    ORDER BY o.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
  console.error("SQL Error:", err); // log full error in terminal
  return res.status(500).json({ success: false, message: err.message });
}


    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    const orders = results.reduce((acc, item) => {
      const {
        order_id,
        address,
        payment_status,
        status,
        created_at,
        product_status,
        product_status_updated,
        item_total,
        ...product
      } = item;

      if (!acc[order_id]) {
        acc[order_id] = {
          order_id,
          address,
          status,
          payment_status,
          created_at,
          product_status,
          product_status_updated,
          total_amount: 0,
          items: []
        };
      }

      acc[order_id].items.push(product);
      acc[order_id].total_amount += item_total;

      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      orders: Object.values(orders)
    });
  });
};
