import express from "express";
import { addCategory, deleteCategory, getCategoriesWithSubcategories, getCategoryById, getCategorys, updateCategory } from "../controller/category.controller.js";
import db from "../config/db.js";

const router = express.Router();

router.post("/add-category", addCategory);
router.get("/get-categorys", getCategorys);
router.get("/get-category/:id", getCategoryById);
router.put("/update-category/:id", updateCategory);
router.delete("/delete-category/:id", deleteCategory);
router.get("/get-categorysubcategory",getCategoriesWithSubcategories);

router.get("/products/:id", (req, res) => {
    const { id } = req.params;

    let query = `SELECT 
            p.*, 
            b.name AS brand_name, 
            c.name AS category_name, 
            sc.name AS subcategory_name,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', pv.id, 
                    'color', pv.color_name, 
                    'code', pv.color_code, 
                    'image', pv.color_image, 
                    'ram', pv.ram, 
                    'size', pv.size
                )
            ) AS variants
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN subcategories sc ON p.sub_category_id = sc.id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        WHERE p.category_id = ? OR p.sub_category_id = ?
        GROUP BY p.id`;

    db.query(query, [id, id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "No products found for this category or subcategory" });
        }

        res.status(200).json({ success: true, products: results });
    });
});




export default router;
