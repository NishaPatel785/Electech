import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist, clearWishlist } from "../controller/wishlist.contoller.js";
import { verifyToken } from "../middleware/auth.js"; 

const router = express.Router();

router.post("/add-wish", verifyToken,addToWishlist);      // Add item to wishlist
router.get("/get-wish", verifyToken, getWishlist);            // Get wishlist items
router.delete("/delete-wish/:id", verifyToken, removeFromWishlist); // Remove single item
router.delete("/clear-wish", verifyToken, clearWishlist);       // Clear entire wishlist

export default router;