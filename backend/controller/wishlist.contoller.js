import db from "../config/db.js";

export const addToWishlist = (req, res) => {
    const { product_id } = req.body;

    console.log("Extracted User from Token:", req.user);

    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized. User ID missing from token." });
    }

    const user_id = req.user.id;

    if (!product_id) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const checkSql = "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?";
    db.query(checkSql, [user_id, product_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: "Product already in wishlist" });
        }

        const insertSql = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";
        db.query(insertSql, [user_id, product_id], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            return res.status(201).json({ success: true, message: "Item added to wishlist" });
        });
    });
};

// ✅ Get Wishlist (Only Logged-in Users)
export const getWishlist = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT 
            w.id AS wishlist_id,
            p.id AS product_id,
            p.thumbnail AS image,
            p.name AS product_name,
            b.name AS brand_name,  
            p.cut_price,
            p.price
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        JOIN brands b ON p.brand_id = b.id  
        WHERE w.user_id = ?
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.status(200).json({ success: true, wishlist: results });
    });
};

// ✅ Remove Item from Wishlist (Only User Can Delete Own Items)
export const removeFromWishlist = (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    const sql = "DELETE FROM wishlist WHERE id = ? AND user_id = ?";
    db.query(sql, [id, user_id], (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Failed to remove item from wishlist" });
        }

        res.status(200).json({ success: true, message: "Item removed from wishlist" });
    });
};

// ✅ Clear Entire Wishlist (Only Logged-in User)
export const clearWishlist = (req, res) => {
    const user_id = req.user.id;

    const sql = "DELETE FROM wishlist WHERE user_id = ?";
    db.query(sql, [user_id], (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Failed to clear wishlist" });
        }

        res.status(200).json({ success: true, message: "Wishlist cleared successfully" });
    });
};
