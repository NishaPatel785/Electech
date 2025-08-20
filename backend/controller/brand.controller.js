import db from "../config/db.js";

// ✅ Add Brand
export const addBrand = (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Brand name is required", success: false });
    }

    const sql = "INSERT INTO brands (name) VALUES (?)";
    db.query(sql, [name], (err, result) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        res.status(201).json({
            message: "Brand added successfully",
            success: true,
            data: { id: result.insertId, name }
        });
    });
};

// ✅ Get All Brands with Products
export const getBrands = (req, res) => {
    const sql = "SELECT id, name FROM brands";

    db.query(sql, (err, brands) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        if (brands.length === 0) {
            return res.status(200).json({ message: "No brands found", success: true, data: [] });
        }

        const brandIds = brands.map(brand => brand.id);

        // ✅ Fetch products for all brands
        const productQuery = "SELECT * FROM products WHERE brand_id IN (?)";
        db.query(productQuery, [brandIds.length ? brandIds : [-1]], (err, products) => {
            if (err) return res.status(500).json({ message: err.message, success: false });

            const brandsWithProducts = brands.map(brand => ({
                ...brand,
                products: products.filter(p => p.brand_id === brand.id)
            }));

            res.status(200).json({
                message: "Brands fetched successfully",
                success: true,
                data: brandsWithProducts
            });
        });
    });
};

// ✅ Get Single Brand by ID with Products
export const getBrandById = (req, res) => {
    const { id } = req.params;

    // ✅ Fetch brand details
    const sql = "SELECT id, name FROM brands WHERE id = ?";
    db.query(sql, [id], (err, brandResults) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        if (brandResults.length === 0) {
            return res.status(404).json({ message: "Brand not found", success: false });
        }

        const brand = brandResults[0];

        // ✅ Fetch products under this brand
        const productQuery = "SELECT * FROM products WHERE brand_id = ?";
        db.query(productQuery, [id], (err, products) => {
            if (err) return res.status(500).json({ message: err.message, success: false });

            res.status(200).json({
                message: "Brand fetched successfully",
                success: true,
                data: {
                    ...brand,
                    products
                }
            });
        });
    });
};

// ✅ Update Brand
export const updateBrand = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Brand name is required", success: false });
    }

    const sql = "UPDATE brands SET name = ? WHERE id = ?";
    db.query(sql, [name, id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        res.status(200).json({ message: "Brand updated successfully", success: true });
    });
};

// ✅ Delete Brand
export const deleteBrand = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM brands WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message, success: false });

        res.status(200).json({ message: "Brand deleted successfully", success: true });
    });
};
