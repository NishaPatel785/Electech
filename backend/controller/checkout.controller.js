import db from "../config/db.js";


// ✅ Direct Checkout (Product Page)
export const directCheckout = (req, res) => {
  const user_id = req.user.id;
  const { product_id, variant_id, quantity } = req.body;

  if (!product_id || !quantity) {
      return res.status(400).json({ success: false, message: "Product ID and Quantity are required" });
  }

  // Check if the product with the same variant is already in checkout
  const checkSql = `SELECT id, quantity FROM checkout WHERE user_id = ? AND product_id = ? AND (variant_id = ? OR variant_id IS NULL)`;

  db.query(checkSql, [user_id, product_id, variant_id || null], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      if (result.length > 0) {
          // Update quantity if already exists
          const updateSql = `UPDATE checkout SET quantity = quantity + ? WHERE id = ?`;

          db.query(updateSql, [quantity, result[0].id], (err) => {
              if (err) return res.status(500).json({ success: false, message: err.message });

              return res.status(200).json({ success: true, message: "Checkout updated successfully" });
          });
      } else {
          // Insert new entry if not exists
          const insertSql = `INSERT INTO checkout (cart_id, user_id, product_id, variant_id, quantity) VALUES (NULL, ?, ?, ?, ?)`;

          db.query(insertSql, [user_id, product_id, variant_id || null, quantity], (err) => {
              if (err) return res.status(500).json({ success: false, message: err.message });

              return res.status(200).json({ success: true, message: "Product checked out successfully" });
          });
      }
  });
};

  
export const checkoutFromCart = (req, res) => {
    const user_id = req.user.id;
  
    const getCartSql = `SELECT * FROM cart WHERE user_id = ?`;
  
    db.query(getCartSql, [user_id], (err, cartItems) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
  
      if (cartItems.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Your cart is empty" });
      }
  
      const processCartItems = (index) => {
        if (index >= cartItems.length) {
          // ✅ Final response includes cartItems
          return res.status(200).json({
            success: true,
            message: "Checked out successfully",
            data: cartItems,
          });
        }
  
        const item = cartItems[index];
        const checkSql = `SELECT id, quantity FROM checkout WHERE user_id = ? AND product_id = ? AND (variant_id = ? OR variant_id IS NULL)`;
  
        db.query(
          checkSql,
          [user_id, item.product_id, item.variant_id || null],
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ success: false, message: err.message });
  
            if (result.length > 0) {
              // Update quantity if already exists
              const updateSql = `UPDATE checkout SET quantity = quantity + ? WHERE id = ?`;
  
              db.query(updateSql, [item.quantity, result[0].id], (err) => {
                if (err)
                  return res
                    .status(500)
                    .json({ success: false, message: err.message });
  
                processCartItems(index + 1);
              });
            } else {
              // Insert new entry if not exists
              const insertSql = `INSERT INTO checkout (cart_id, user_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?, ?)`;
  
              db.query(
                insertSql,
                [
                  item.id,
                  user_id,
                  item.product_id,
                  item.variant_id || null,
                  item.quantity,
                ],
                (err) => {
                  if (err)
                    return res
                      .status(500)
                      .json({ success: false, message: err.message });
  
                  processCartItems(index + 1);
                }
              );
            }
          }
        );
      };
  
      processCartItems(0);
    });
  };
  

  
  

// ✅ Get Total Checkout Amount
export const getCheckoutTotal = (req, res) => {
  const user_id = req.user.id;
  const { from_cart } = req.query; // Check if the request is from cart checkout

  let sql = `
    SELECT 
    c.id,
    c.product_id,
    c.variant_id,
    p.name AS product_name,
    v.price,
    v.ram,
    v.size,
    v.color_name,
    COALESCE(v.color_image, p.thumbnail) AS image,  -- ✅ Use variant image if available, else product thumbnail
    c.quantity,
    (v.price * c.quantity) AS subtotal
FROM checkout c
JOIN product_variants v ON c.variant_id = v.id
JOIN products p ON c.product_id = p.id
WHERE c.user_id = ?
  `;

  const params = [user_id];

  if (from_cart === "true") {
      sql += ` AND c.cart_id IS NOT NULL`; 
  } else {
      sql += ` AND c.cart_id IS NULL`; 
  }

  db.query(sql, params, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

    
      const total_amount = result.reduce((sum, item) => sum + item.subtotal, 0);

      return res.status(200).json({ success: true, total_amount, products: result });
  });
};

  


// ✅ Cancel a Checkout Order
export const cancelCheckout = (req, res) => {
  const user_id = req.user.id;
  const { checkout_id } = req.body;

  if (!checkout_id) {
    return res.status(400).json({ success: false, message: "Checkout ID is required" });
  }

  const deleteSql = `DELETE FROM checkout WHERE id = ? AND user_id = ?`;

  db.query(deleteSql, [checkout_id, user_id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    return res.status(200).json({ success: true, message: "Checkout order canceled successfully" });
  });
};


export const clearCheckout = (req, res) => {
  const user_id = req.user.id;

  const deleteSql = `DELETE FROM checkout WHERE user_id = ?`;

  db.query(deleteSql, [user_id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      return res.status(200).json({ success: true, message: "All checkout items cleared successfully" });
  });
};
