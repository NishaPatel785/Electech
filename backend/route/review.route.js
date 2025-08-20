import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { addToReview,getReviews } from "../controller/review.controller.js";

const router = express.Router();

router.post("/add-review", verifyToken, addToReview);
router.get("/get-review/:product_id",verifyToken, getReviews);

export default router;
