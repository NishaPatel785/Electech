import db from "../config/db.js";
import multer from "multer";
import fs from "fs";
import path from "path";

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "./uploads/products";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "hoverimage", maxCount: 1 },
    { name: "descimage", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "colorimage", maxCount: 10 }
]);

// ✅ Add Product
// ✅ Add Product Controller (Improved)
export const addProduct = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({ message: err.message, success: false });
        }

        const {
            name, price, shortDesc, cut_price, category_id, brand_id, sub_category_id,
            sku, discount, stock, availableStock, tags, rating,
            longDesc1, longDesc2, longDesc3
        } = req.body;

        const cutPrice = cut_price || null;
        const discountValue = discount || null;
        const ratingValue = rating || null;
        const subCategoryId = sub_category_id || null;
        const categoryId = category_id || null;
        const brandId = brand_id || null;

        // File handling
        const thumbnail = req.files["thumbnail"]?.[0]?.filename || null;
        const hoverimage = req.files["hoverimage"]?.[0]?.filename || null;
        const descimage = req.files["descimage"]?.[0]?.filename || null;
        const images = req.files["images"]?.map(file => file.filename) || [];
        const imagesString = JSON.stringify(images);

        // Color images for variants
        const colorImages = req.files["colorimage"] || [];

        // Parse variant data
        let variants = [];
        try {
            if (req.body.variants) {
                variants = JSON.parse(req.body.variants);
                if (!Array.isArray(variants)) {
                    throw new Error("Variants should be an array");
                }
            }
        } catch (e) {
            return res.status(400).json({ message: "Invalid variants format", success: false });
        }

        // Insert Product
        const productSql = `
            INSERT INTO products 
            (name, price, shortDesc, cut_price, category_id, brand_id, sub_category_id, sku, discount, stock, availableStock, tags, rating, longDesc1, longDesc2, longDesc3, thumbnail, hoverimage, descimage, images) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(productSql, [
            name, price, shortDesc, cutPrice, categoryId, brandId, subCategoryId,
            sku, discountValue, stock, availableStock, tags, ratingValue,
            longDesc1, longDesc2, longDesc3,
            thumbnail, hoverimage, descimage, imagesString
        ], (err, result) => {
            if (err) {
                console.error("Product Insert Error:", err.message);
                return res.status(500).json({ message: "Failed to insert product", success: false });
            }

            const productId = result.insertId;

            // Insert Variants
            if (variants.length > 0) {
                const variantSql = `
                    INSERT INTO product_variants 
                    (product_id, color_name, color_code, color_image, ram, size, availableStock, stock, price, sku) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                variants.forEach((variant, index) => {
                    const {
                        color_name, color_code, ram, size,
                        availableStock, stock, price, sku
                    } = variant;

                    const color_image = colorImages[index]?.filename || null;

                    db.query(variantSql, [
                        productId, color_name, color_code, color_image,
                        ram, size, availableStock, stock, price, sku
                    ], (err) => {
                        if (err) {
                            console.error(`Variant Insert Error (index ${index}):`, err.message);
                        }
                    });
                });
            }

            res.status(201).json({
                message: "Product added successfully",
                success: true,
                productId
            });
        });
    });
};





export const getProductById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 
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
                    'size', pv.size,
                    'availableStock', pv.availableStock,
                    'stock', pv.stock,
                    'price', pv.price,
                    'sku', pv.sku
                )
            ) AS variants
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN subcategories sc ON p.sub_category_id = sc.id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        WHERE p.id = ?
        GROUP BY p.id
    `;

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        if (results.length === 0) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        res.status(200).json({ success: true, product: results[0] });
    });
};


// ✅ Get All Products
export const getAllProducts = (req, res) => {
    const sql = `
        SELECT 
            p.*, 
            b.name AS brand_name, 
            c.name AS category_name, 
            sc.name AS subcategory_name,
            JSON_ARRAYAGG(JSON_OBJECT('id', pv.id, 'color', pv.color_name, 'code', pv.color_code, 'image', pv.color_image, 'ram', pv.ram, 'size', pv.size)) AS variants
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN subcategories sc ON p.sub_category_id = sc.id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        GROUP BY p.id
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        res.status(200).json({ success: true, products: results });
    });
};



export const deleteProduct = (req, res) => {
    const { id } = req.params;

    console.log("Deleting product ID:", id);


    // Step 1: Get main product images
    db.query(`SELECT thumbnail, hoverimage, descimage, images FROM products WHERE id = ?`, [id], (err, productResults) => {
        if (err) return res.status(500).json({ message: "delelte fail", success: false });

        if (productResults.length === 0) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        const { thumbnail, hoverimage, descimage, images } = productResults[0];
        const mainImages = [
            thumbnail,
            hoverimage,
            descimage,
            ...(images ? JSON.parse(images) : [])
        ];

        // Step 2: Get variant images
        db.query(`SELECT color_image FROM product_variants WHERE product_id = ?`, [id], (err, variantResults) => {
            if (err) return res.status(500).json({ message: "Failed to fetch variant images delted", success: false });

            const variantImages = variantResults.map(v => v.color_image).filter(Boolean);

            // Combine all images (main + variants)
            const allImages = [...mainImages, ...variantImages];

            allImages.forEach((file) => {
                const filePath = path.join("uploads", "products", file);
                fs.access(filePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(filePath, (err) => {
                            if (err) console.error(`❌ Failed to delete image: ${filePath}`, err.message);
                            else console.log(`✅ Deleted image: ${filePath}`);
                        });
                    } else {
                        console.warn(`⚠️ File not found, skipping: ${filePath}`);
                    }
                });
            });

            // Step 3: Delete the product and its variants from the database
            db.query(`DELETE FROM products WHERE id = ?`, [id], (err) => {
                if (err) return res.status(500).json({ message: "product not deleted", success: false });

                // Optional: also delete from variants table
                db.query(`DELETE FROM product_variants WHERE product_id = ?`, [id], (err) => {
                    if (err) console.error("Failed to delete variants:", err.message);
                });

                res.status(200).json({ message: "Product and all related images deleted successfully", success: true });
            });
        });
    });
};







export const updateProduct = (req, res) => {
    const { id } = req.params;

    upload(req, res, (err) => {
        if (err) return res.status(400).json({ message: "File upload error", success: false });

        db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
            if (err) return res.status(500).json({ message: err.message, success: false });
            if (results.length === 0) return res.status(404).json({ message: "Product not found", success: false });

            const product = results[0];

            // Updated fields (fallback to existing values if not provided)
            const updatedFields = {
                name: req.body.name || product.name,
                price: req.body.price || product.price,
                shortDesc: req.body.shortDesc || product.shortDesc,
                cut_price: req.body.cut_price === "" || req.body.cut_price === "null" ? null : req.body.cut_price || product.cut_price,
                sub_category_id: req.body.sub_category_id === "" || req.body.sub_category_id === "null" ? null : parseInt(req.body.sub_category_id) || product.sub_category_id,
                category_id: req.body.category_id === "" || req.body.category_id === "null" ? null : parseInt(req.body.category_id) || product.category_id,
                brand_id: req.body.brand_id === "" || req.body.brand_id === "null" ? null : parseInt(req.body.brand_id) || product.brand_id,
                sku: req.body.sku || product.sku,
                discount: req.body.discount || product.discount,
                stock: req.body.stock || product.stock,
                availableStock: req.body.availableStock || product.availableStock,
                tags: req.body.tags || product.tags,
                rating: req.body.rating || product.rating,
                longDesc1: req.body.longDesc1 || product.longDesc1,
                longDesc2: req.body.longDesc2 || product.longDesc2,
                longDesc3: req.body.longDesc3 || product.longDesc3,
                thumbnail: req.files["thumbnail"]?.[0]?.filename || product.thumbnail,
                hoverimage: req.files["hoverimage"]?.[0]?.filename || product.hoverimage,
                descimage: req.files["descimage"]?.[0]?.filename || product.descimage,
                images: req.files["images"] ? JSON.stringify(req.files["images"].map(f => f.filename)) : product.images
            };

            const updateSql = `
        UPDATE products SET 
          name = ?, price = ?, shortDesc = ?, cut_price = ?, sub_category_id = ?, category_id = ?, brand_id = ?, sku = ?, 
          discount = ?, stock = ?, availableStock = ?, tags = ?, rating = ?, 
          longDesc1 = ?, longDesc2 = ?, longDesc3 = ?, thumbnail = ?, hoverimage = ?, descimage = ?, images = ? 
        WHERE id = ?
      `;

            const values = [
                updatedFields.name, updatedFields.price, updatedFields.shortDesc, updatedFields.cut_price,
                updatedFields.sub_category_id, updatedFields.category_id, updatedFields.brand_id, updatedFields.sku,
                updatedFields.discount, updatedFields.stock, updatedFields.availableStock, updatedFields.tags,
                updatedFields.rating, updatedFields.longDesc1, updatedFields.longDesc2, updatedFields.longDesc3,
                updatedFields.thumbnail, updatedFields.hoverimage, updatedFields.descimage, updatedFields.images,
                id
            ];

            db.query(updateSql, values, (err) => {
                if (err) return res.status(500).json({ message: err.message, success: false });

                res.status(200).json({ message: "Product updated successfully", success: true });
            });
        });
    });
};




