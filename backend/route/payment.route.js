import express from "express";
import { createRazorpayOrder,getRazorpayKey,verifyRazorpayPayment } from "../controller/payment.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/key",getRazorpayKey)
router.get("/create-order", verifyToken, createRazorpayOrder);
router.post("/verify-payment", verifyToken, verifyRazorpayPayment);

export default router;
