import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { checkoutFromCart,cancelCheckout,directCheckout,getCheckoutTotal,clearCheckout } from "../controller/checkout.controller.js";

const router = express.Router();

router.post("/direct-checkout", verifyToken, directCheckout); 
router.get("/cart-checkout", verifyToken, checkoutFromCart); 
router.get("/get-checkout", verifyToken, getCheckoutTotal); 
router.delete("/cancel-checkout", verifyToken, cancelCheckout); 
router.delete("/clear-checkout", verifyToken, clearCheckout); 

export default router;
