import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "./uploads/subcategory_images";
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

const upload = multer({ storage: storage }).single("sub_image");


export const addSubCategory = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            if (err) {
                console.error("Multer Error:", err);
                return res.status(400).json({ message: "File upload error", success: false });
            }
            console.log("File uploaded successfully:", req.file);
        }

        const { name, category_id } = req.body;
        const sub_image = req.file ? req.file.filename : null;

        if (!name || !category_id) {
            return res.status(400).json({ message: "Subcategory name and category ID are required", success: false });
        }

        const sql = "INSERT INTO subcategories (name, sub_image, category_id) VALUES (?, ?, ?)";
        db.query(sql, [name, sub_image, category_id], (err, result) => {
            if (err) return res.status(500).json({ message: err.message, success: false });

            res.status(201).json({
                message: "Subcategory added successfully",
                success: true,
                data: result
            });
        });
    });
};

export const getSubCategories = (req, res) => {
    const sql = `SELECT id, name, sub_image, category_id FROM subcategories`;

    db.query(sql, (err, subcategories) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        if (subcategories.length === 0) {
            return res.status(200).json({ message: "No subcategories found", success: true, data: [] });
        }

        const subCategoryIds = subcategories.map(sub => sub.id);

        // ✅ Fetch products for all subcategories
        const productQuery = `SELECT * FROM products WHERE sub_category_id IN (?)`;
        db.query(productQuery, [subCategoryIds.length ? subCategoryIds : [-1]], (err, products) => {
            if (err) return res.status(500).json({ message: err.message, success: false });

            const subcategoriesWithProducts = subcategories.map(sub => ({
                ...sub,
                sub_image: sub.sub_image ? `http://localhost:6001/node-files/subcategory_images/${sub.sub_image}` : null,
                products: products.filter(p => p.sub_category_id === sub.id)
            }));

            res.status(200).json({
                message: "Subcategories fetched",
                success: true,
                data: subcategoriesWithProducts,
                filepath: "http://localhost:6001/node-files/subcategory_images/",
            });
        });
    });
};

// ✅ Get Subcategory by ID
export const getSubCategoryById = (req, res) => {
    const { id } = req.params;

    // ✅ Fetch subcategory details
    const sql = `SELECT id, name, sub_image, category_id FROM subcategories WHERE id = ?`;
    db.query(sql, [id], (err, subcategoryResults) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        if (subcategoryResults.length === 0) {
            return res.status(404).json({ message: "Subcategory not found", success: false });
        }

        const subcategory = subcategoryResults[0];
        subcategory.sub_image = subcategory.sub_image
            ? `http://localhost:6001/uploads/subcategory_images/${subcategory.sub_image}`
            : null;

        // ✅ Fetch products under this subcategory
        const productQuery = `SELECT * FROM products WHERE sub_category_id = ?`;
        db.query(productQuery, [id], (err, products) => {
            if (err) return res.status(500).json({ message: err.message, success: false });

            res.status(200).json({
                message: "Subcategory fetched",
                success: true,
                data: {
                    ...subcategory,
                    products
                },
                filepath: "http://localhost:6001/node-files/subcategory_images/"
            });
        });
    });
};

// ✅ Update Subcategory (With or Without Image)
export const updateSubCategory = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload error", success: false });
        }

        const { id } = req.params;
        const { name, category_id } = req.body;
        const sub_image = req.file ? req.file.filename : null;

        // Check if subcategory exists
        db.query("SELECT sub_image FROM subcategories WHERE id = ?", [id], (err, results) => {
            if (err) return res.status(500).json({ message: err.message, success: false });

            if (results.length === 0) {
                return res.status(404).json({ message: "Subcategory not found", success: false });
            }

            const oldImage = results[0].sub_image;
            let updateFields = [];
            let values = [];

            if (name) {
                updateFields.push("name = ?");
                values.push(name);
            }

            if (category_id) {
                updateFields.push("category_id = ?");
                values.push(category_id);
            }

            if (sub_image) {
                updateFields.push("sub_image = ?");
                values.push(sub_image);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ message: "No fields to update", success: false });
            }

            values.push(id);
            const sql = `UPDATE subcategories SET ${updateFields.join(", ")} WHERE id = ?`;

            db.query(sql, values, (err, result) => {
                if (err) return res.status(500).json({ message: err.message, success: false });

                // ✅ Delete old image if a new one was uploaded
                if (sub_image && oldImage) {
                    const imagePath = `./uploads/subcategory_images/${oldImage}`;
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }

                res.status(200).json({ message: "Subcategory updated successfully", success: true });
            });
        });
    });
};
// ✅ Delete Subcategory
export const deleteSubCategory = (req, res) => {
    const { id } = req.params;

    // ✅ Check if the subcategory exists
    db.query("SELECT sub_image FROM subcategories WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        if (results.length === 0) {
            return res.status(404).json({ message: "Subcategory not found", success: false });
        }

        const sub_image = results[0].sub_image;

        // ✅ Delete subcategory from the database
        db.query("DELETE FROM subcategories WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ message: err.message, success: false });

            // ✅ Delete associated image if exists
            if (sub_image) {
                const imagePath = `./uploads/subcategory_images/${sub_image}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            res.status(200).json({ message: "Subcategory deleted successfully", success: true });
        });
    });
};
