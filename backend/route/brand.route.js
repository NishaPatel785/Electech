import express from "express";
import { addBrand, deleteBrand, getBrandById, getBrands, updateBrand } from "../controller/brand.controller.js";

const router = express.Router();

router.post("/add-brand", addBrand);
router.get("/get-brands", getBrands);
router.get("/get-brand/:id", getBrandById);
router.put("/update-brand/:id", updateBrand);
router.delete("/delete-brand/:id", deleteBrand);

export default router;
