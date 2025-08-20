import express from "express"
import { verifyToken } from "../middleware/auth.js";
import { addToCart,clearCart,deleteProductFromCart,getCartItems,removeFromCart, updateCartItems } from "../controller/addToCart.controller.js";

const router = express.Router();

router.post("/addCart", verifyToken, addToCart);

router.post("/removeCart", verifyToken, removeFromCart);
router.post("/deleteCart",verifyToken,deleteProductFromCart)
router.get("/getCart", verifyToken,getCartItems);
router.put("/updateCart/:id",verifyToken,updateCartItems)
router.delete("/clearCart", verifyToken,clearCart);


export default router;

