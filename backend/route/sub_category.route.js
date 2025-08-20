import express from "express";
import { addSubCategory, deleteSubCategory, getSubCategories, getSubCategoryById, updateSubCategory } from "../controller/sub_category.controller.js";



const router = express.Router();

router.post("/add-subcategory", addSubCategory);
router.get("/get-subcategorys", getSubCategories);
router.get("/get-subcategory/:id", getSubCategoryById);
router.put("/update-subcategory/:id", updateSubCategory);
router.delete("/delete-subcategory/:id", deleteSubCategory);

export default router;
