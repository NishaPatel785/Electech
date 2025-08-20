import express from "express";
import { addProduct,getProductById,updateProduct,getAllProducts,deleteProduct } from "../controller/product.controller.js";
import { admin } from "../middleware/auth.js";

const router = express.Router();

// router.post("/add-product",admin, addProduct);
router.post("/add-product", addProduct);
router.get("/get-products", getAllProducts);
router.get("/get-product/:id", getProductById);
router.put("/update-product/:id", updateProduct);
// router.put("/update-product/:id",admin, updateProduct);
router.delete("/delete-product/:id", deleteProduct);
// router.delete("/delete-product/:id",admin, deleteProduct);

export default router;
