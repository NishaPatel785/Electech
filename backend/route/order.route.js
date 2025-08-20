
import express from "express";
import db from "../config/db.js";
import { getAllUserOrders, getOrders } from "../controller/orders.controller.js";
import { verifyToken } from "../middleware/auth.js";
import {updateDeliveryStatus,getAllOrders} from "../controller/order.controller.js"

const router = express.Router();

router.get("/my-orders", verifyToken, getOrders);
router.get("/all-orders", verifyToken, getAllOrders);
router.get("/all-user-orders",getAllUserOrders);

router.put("/update-status",verifyToken, (req, res) => {
  const { order_id, product_status } = req.body;
   console.log(order_id);
  if (!order_id || !product_status) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  const sql = "UPDATE order_status SET status = ? WHERE order_id = ?";
  db.query(sql, [product_status, order_id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "Product status updated successfully" });
  });
});


export default router;
