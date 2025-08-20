import db from "../config/db.js";

export const addToReview = (req, res) => {
    const { product_id, rating, comment } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized. User ID missing from token." });
    }

    if (!product_id || !rating || !comment) {
        return res.status(400).json({ success: false, message: "Product ID, rating, and comment are required." });
    }

    const user_id = req.user.id;

    const query = `
        INSERT INTO reviews (user_id, product_id, rating, comment, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;

    db.query(query, [user_id, product_id, rating, comment], (err, result) => {
        if (err) {
            console.error("Error adding review:", err);
            return res.status(500).json({ success: false, message: "Internal server error." });
        }

        res.status(201).json({ success: true, message: "Review added successfully." ,data:result});
    });
};

export const getReviews = (req, res) => {
    const { product_id } = req.params;

    if (!product_id) {
        return res.status(400).json({ success: false, message: "Product ID is required." });
    }

    const query = `
        SELECT r.id, r.rating, r.comment, r.created_at, u.first_name as user_name,
        u.last_name AS last_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC
    `;

    db.query(query, [product_id], (err, results) => {
        if (err) {
            console.error("Error fetching reviews:", err);
            return res.status(500).json({ success: false, message: "Internal server error." });
        }

        res.status(200).json({ success: true, reviews: results });
    });
};
