import dotenv from "dotenv";
dotenv.config();
import db from "../config/db.js";
import razorpayInstance from "../config/razorpay.js";
import crypto from "crypto";
import sendOrderConfirmationEmail from "../config/utils/sendmail.js";

export const getRazorpayKey = (req, res) => {
  try {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error("❌ Error fetching Razorpay key:", error);
    res.status(500).json({ success: false, message: "Error fetching Razorpay key" });
  }
};

export const createRazorpayOrder = (req, res) => {
  const user_id = req.user.id;
  const { from_cart } = req.query;

  let sql = `
    SELECT 
      p.name AS product_name,
      c.product_id,
      c.variant_id,
      COALESCE(v.price, p.price) AS price,
      c.quantity,
      (COALESCE(v.price, p.price) * c.quantity) AS subtotal
    FROM checkout c
    LEFT JOIN product_variants v ON c.variant_id = v.id
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?`;

  if (from_cart === "true") {
    sql += ` AND c.cart_id IS NOT NULL`;
  } else {
    sql += ` AND c.cart_id IS NULL`;
  }

  db.query(sql, [user_id], async (err, items) => {
    if (err) {
      console.error("❌ Error fetching checkout items:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch items" });
    }

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in checkout" });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    try {
      const order = await razorpayInstance.orders.create(options);
      res.status(200).json({ success: true, order, items, key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
      console.error("❌ Error creating Razorpay order:", error);
      res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
    }
  });
};

export const verifyRazorpayPayment = async (req, res) => {
  const { response, amount, deliveryInfo, from_cart } = req.body;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response || {};
  const user_id = req.user.id;
  const fromCart = from_cart === true || from_cart === "true";

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "Missing Razorpay response data" });
  }

  // Step 1: Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const orderAmount = amount / 100;
  const { name, email, address, city, postalCode } = deliveryInfo || {};

  if (!name || !email || !address || !city || !postalCode) {
    return res.status(400).json({ success: false, message: "Missing delivery info" });
  }

  try {
    // Step 2: Create order
    const [orderResult] = await db.promise().query(
      `INSERT INTO orders (user_id, amount, status, razorpay_order_id, razorpay_payment_id, name, email, address, city, postal_code)
       VALUES (?, ?, 'paid', ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, orderAmount, razorpay_order_id, razorpay_payment_id, name, email, address, city, postalCode]
    );
    const order_id = orderResult.insertId;

    // Step 3: Get checkout items
    const [items] = await db.promise().query(
      `SELECT c.product_id, c.variant_id, c.quantity, COALESCE(v.price, p.price) AS price, p.name AS product_name
       FROM checkout c
       LEFT JOIN product_variants v ON c.variant_id = v.id
       LEFT JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ? AND ${fromCart ? "c.cart_id IS NOT NULL" : "c.cart_id IS NULL"}`,
      [user_id]
    );

    // Step 3.1: Filter out invalid products
    const validItems = items.filter(item => item.product_name);
    const invalidItems = items.filter(item => !item.product_name);

    if (invalidItems.length > 0) {
      // Optional: auto-remove invalid items from checkout
      await Promise.all(
        invalidItems.map(item =>
          db.promise().query(
            `DELETE FROM checkout WHERE user_id = ? AND product_id = ?`,
            [user_id, item.product_id]
          )
        )
      );

      return res.status(400).json({
        success: false,
        message: "Some products are no longer available. Please update your cart.",
        invalidItems: invalidItems.map(i => i.product_id),
      });
    }

    // Step 4: Bulk insert order_items
    const orderItemsData = validItems.map(item => [
      order_id,
      user_id,
      item.product_id,
      item.variant_id,
      item.quantity,
      item.price,
    ]);

    if (orderItemsData.length > 0) {
      await db.promise().query(
        `INSERT INTO order_items (order_id, user_id, product_id, variant_id, quantity, price) VALUES ?`,
        [orderItemsData]
      );
    }

    // Step 5: Insert order status
    await db.promise().query(
      `INSERT INTO order_status (order_id, status) VALUES (?, ?)`,
      [order_id, "processing"]
    );

    // Step 6: Send confirmation email
    await sendOrderConfirmationEmail({
      to: email,
      name,
      orderId: order_id,
      items: validItems,
      amount: orderAmount,
      address,
      city,
      postalCode,
    });

    // Step 7: Clear checkout
    await db.promise().query(
      `DELETE FROM checkout WHERE user_id = ? AND ${fromCart ? "cart_id IS NOT NULL" : "cart_id IS NULL"}`,
      [user_id]
    );

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order_id,
      amount: orderAmount,
      items: validItems,
    });

  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
};


