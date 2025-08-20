import db from "../config/db.js";


export const addToCart = (req, res) => {
  const user_id = req.user.id;
  const { product_id, variant_id, quantity = 1 } = req.body;

  if (!product_id || !variant_id) {
    return res.status(400).json({ success: false, message: "Product ID and Variant ID are required" });
  }

  // Check if the product variant is already in the cart
  const checkSql = `SELECT quantity FROM cart WHERE user_id = ? AND variant_id = ?`;

  db.query(checkSql, [user_id, variant_id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (result.length > 0) {
      // If the variant exists, increase the quantity
      const newQuantity = result[0].quantity + quantity;
      const updateSql = `UPDATE cart SET quantity = ? WHERE user_id = ? AND variant_id = ?`;

      db.query(updateSql, [newQuantity, user_id, variant_id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        return res.status(200).json({ success: true, message: "Quantity updated", quantity: newQuantity });
      });
    } else {
      // If the variant does not exist, insert it with quantity = 1
      const insertSql = `INSERT INTO cart (user_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)`;

      db.query(insertSql, [user_id, product_id, variant_id, quantity], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        return res.status(200).json({ success: true, message: "Product variant added to cart", quantity });
      });
    }
  });
};



// ✅ Remove or Decrease Cart Item Quantity
export const removeFromCart = (req, res) => {
  const user_id = req.user.id;
  const { product_id, variant_id } = req.body;

  const checkSql = `SELECT quantity FROM cart WHERE user_id = ? AND product_id = ? AND variant_id = ?`;
  db.query(checkSql, [user_id, product_id, variant_id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.length === 0) return res.status(404).json({ success: false, message: "Item not found in cart" });

    const newQuantity = result[0].quantity - 1;
    if (newQuantity > 0) {
      // Update quantity
      const updateSql = `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ? AND variant_id = ?`;
      db.query(updateSql, [newQuantity, user_id, product_id, variant_id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        return res.status(200).json({ success: true, message: "Quantity decreased", quantity: newQuantity });
      });
    } else {
      // Remove item when quantity reaches zero
      const deleteSql = `DELETE FROM cart WHERE user_id = ? AND product_id = ? AND variant_id = ?`;
      db.query(deleteSql, [user_id, product_id, variant_id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        return res.status(200).json({ success: true, message: "Item removed from cart" });
      });
    }
  });
};

export const deleteProductFromCart = (req, res) => {
  const user_id = req.user.id;
  const { variant_id } = req.body;

  if (!variant_id) {
    return res.status(400).json({ success: false, message: "Variant ID is required" });
  }

  // Check if the specific variant exists in the cart
  const checkSql = `SELECT * FROM cart WHERE user_id = ? AND variant_id = ?`;

  db.query(checkSql, [user_id, variant_id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.length === 0) return res.status(404).json({ success: false, message: "Variant not found in cart" });

    // Delete only the specific variant
    const deleteSql = `DELETE FROM cart WHERE user_id = ? AND variant_id = ?`;

    db.query(deleteSql, [user_id, variant_id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.status(200).json({ success: true, message: "Variant removed from cart" });
    });
  });
};



// ✅ Get Cart Items
export const getCartItems = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT 
      c.*, 
      p.name AS product_name,    
      p.price as product_price, 
      p.thumbnail,
      b.name AS brand_name,  
      v.color_name, 
      v.ram, 
      v.size,
      v.color_image AS variant_image,
      v.price AS variant_price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    JOIN brands b ON p.brand_id = b.id  
    LEFT JOIN product_variants v ON c.variant_id = v.id
    WHERE c.user_id = ?;
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    // 🧮 Calculate total price
    const totalAmount = result.reduce((acc, item) => {
      const price = item.variant_price || item.product_price;
      return acc + price * item.quantity;
    }, 0);

    return res.status(200).json({ success: true, cart: result,totalAmount  });
  });
};


export const updateCartItems = (req, res) => {
  const user_id = req.user.id; 
  const { id } = req.params; 
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
  }

  const checkSql = `SELECT * FROM cart WHERE id = ? AND user_id = ?`;
  db.query(checkSql, [id, user_id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.length === 0) return res.status(404).json({ success: false, message: "Item not found in cart" });

    const updateSql = `UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?`;
    db.query(updateSql, [quantity, id, user_id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.status(200).json({ success: true, message: "Cart updated", quantity });
    });
  });
};


export const clearCart = (req, res) => {
  const user_id = req.user.id;

  const deleteSql = `DELETE FROM cart WHERE user_id = ?`;
  db.query(deleteSql, [user_id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.status(200).json({ success: true, message: "Cart cleared successfully" });
  });
};
