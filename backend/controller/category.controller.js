import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "./uploads/category_images";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage }).single("cat_image");

export const addCategory = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload error", success: false });
        }

        const { name } = req.body;
        const cat_image = req.file ? req.file.filename : null;

        if (!name) {
            return res.status(400).json({ message: "Category name is required", success: false });
        }

        const sql = "INSERT INTO categories (name, cat_image) VALUES (?, ?)";
        db.query(sql, [name, cat_image], (err, result) => {
            if (err) return res.status(500).json({ message: err.message, success: false });

            res.status(201).json({
                message: "Category added successfully",
                success: true,
                data: result
            });
        });
    });
};

export const getCategorys = (req, res) => {
    // Fetch all categories
    const categoryQuery = `SELECT * FROM categories`;

    db.query(categoryQuery, (err, categories) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        if (categories.length === 0) {
            return res.status(200).json({ success: true, message: "No categories found", categories: [] });
        }

        const categoryIds = categories.map(cat => cat.id);

        // Fetch subcategories for all categories
        const subCategoryQuery = `SELECT * FROM subcategories WHERE category_id IN (?)`;
        db.query(subCategoryQuery, [categoryIds.length ? categoryIds : [-1]], (err, subcategories) => {
            if (err) return res.status(500).json({ message: err.message, success: false });

            const subCategoryIds = subcategories.map(sub => sub.id);

            // Fetch products for both categories and subcategories
            const productQuery = `SELECT * FROM products WHERE sub_category_id IN (?) OR category_id IN (?)`;
            db.query(productQuery, [subCategoryIds.length ? subCategoryIds : [-1], categoryIds.length ? categoryIds : [-1]], (err, products) => {
                if (err) return res.status(500).json({ message: err.message, success: false });

                // Structure data properly
                const categoryData = categories.map(category => {
                    const categorySubcategories = subcategories.filter(sub => sub.category_id === category.id);
                    const categoryProducts = products.filter(prod =>
                        prod.category_id === category.id || categorySubcategories.some(sub => sub.id === prod.sub_category_id)
                    );

                    return {
                        ...category,
                        subcategories: categorySubcategories,
                        products: categoryProducts
                    };
                });

                res.status(200).json({
                    success: true,
                    categories: categoryData,
                    filepath: "http://localhost:6001/node-files/category_images/",
                    pfilepath: "http://localhost:6001/node-files/products/",
                });
            });
        });
    });
};

export const getCategoryById = (req, res) => {
    const { id } = req.params;

    // Fetch the main category
    const categoryQuery = `SELECT id, name, cat_image FROM categories WHERE id = ?`;

    db.query(categoryQuery, [id], (err, categoryResults) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        if (categoryResults.length === 0) {
            return res.status(404).json({ message: "Category not found", success: false });
        }

        const category = categoryResults[0];
        category.cat_image = category.cat_image
            ? `http://localhost:6001/uploads/category_images/${category.cat_image}`
            : null;

        // Fetch subcategories
        const subCategoryQuery = `SELECT * FROM subcategories WHERE category_id = ?`;
        db.query(subCategoryQuery, [id], (err, subcategories) => {
            if (err) return res.status(500).json({ message: err.message, success: false });

            const subCategoryIds = subcategories.map(sub => sub.id);
 
            // Fetch products (for both category & subcategories)
            const productQuery = `SELECT * FROM products WHERE category_id = ? OR sub_category_id IN (?)`;
            db.query(productQuery, [id, subCategoryIds.length ? subCategoryIds : [-1]], (err, products) => {
                if (err) return res.status(500).json({ message: err.message, success: false });

                return res.status(200).json({
                    success: true,
                    category: {
                        ...category,
                        subcategories,
                        products
                    },
                    filepath: "http://localhost:6001/node-files/category_images/"
                });
            });
        });
    });
};

// ✅ Update Category (With or Without Image)
export const updateCategory = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload error", success: false });
        }

        const { id } = req.params;
        const { name } = req.body;
        const cat_image = req.file ? req.file.filename : null;

        // Check if category exists
        db.query("SELECT cat_image FROM categories WHERE id = ?", [id], (err, results) => {
            if (err) return res.status(500).json({ message: err.message, success: false });

            if (results.length === 0) {
                return res.status(404).json({ message: "Category not found", success: false });
            }

            const oldImage = results[0].cat_image;
            let updateFields = [];
            let values = [];

            if (name) {
                updateFields.push("name = ?");
                values.push(name);
            }

            if (cat_image) {
                updateFields.push("cat_image = ?");
                values.push(cat_image);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ message: "No fields to update", success: false });
            }

            values.push(id);
            const sql = `UPDATE categories SET ${updateFields.join(", ")} WHERE id = ?`;

            db.query(sql, values, (err, result) => {
                if (err) return res.status(500).json({ message: err.message, success: false });

                // Delete old image if a new one was uploaded
                if (cat_image && oldImage) {
                    const imagePath = `./uploads/category_images/${oldImage}`;
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }

                res.status(200).json({ message: "Category updated successfully", success: true });
            });
        });
    });
};
// ✅ Delete Category
export const deleteCategory = (req, res) => {
    const { id } = req.params;

    // ✅ Check if the category exists
    db.query("SELECT cat_image FROM categories WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        if (results.length === 0) {
            return res.status(404).json({ message: "Category not found", success: false });
        }

        const cat_image = results[0].cat_image;

        // ✅ Delete category from the database
        db.query("DELETE FROM categories WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ message: err.message, success: false });

            // ✅ Delete associated image if exists
            if (cat_image) {
                const imagePath = `./uploads/category_images/${cat_image}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            res.status(200).json({ message: "Category deleted successfully", success: true });
        });
    });
};


export const getCategoriesWithSubcategories = (req, res) => {
    const sql = `
        SELECT 
            c.id AS item_id, 
            c.name AS item_name, 
            c.cat_image AS image, 
            'category' AS type, 
            NULL AS category_id,
            COUNT(p.id) AS product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id

        UNION ALL

        SELECT 
            s.id AS item_id, 
            s.name AS item_name, 
            s.sub_image AS image, 
            'subcategory' AS type, 
            s.category_id, 
            COUNT(p.id) AS product_count
        FROM subcategories s
        LEFT JOIN products p ON s.id = p.sub_category_id
        GROUP BY s.id

        ORDER BY item_name ASC;
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        // Modify the response to include full image URLs
        const baseCategoryPath = "http://localhost:6001/node-files/category_images/";
        const baseSubcategoryPath = "http://localhost:6001/node-files/subcategory_images/";

        const formattedResults = results.map(item => ({
            ...item,
            image: item.image
                ? item.type === "category"
                    ? `${baseCategoryPath}${item.image}`
                    : `${baseSubcategoryPath}${item.image}`
                : null
        }));

        res.status(200).json({
            success: true,
            data: formattedResults
        });
    });
};
