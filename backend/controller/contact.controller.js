import db from "../config/db.js";

// Add Contact Message (User must be logged in)
export const createContact = (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
    }

    const { name, email, phone_number, comment } = req.body;

    if (!name || !email || !phone_number || !comment) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const sql = "INSERT INTO contact (user_id, name, email, phone_number, comment) VALUES (?, ?, ?, ?, ?)";
    const values = [userId, name, email, phone_number, comment];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.status(201).json({ success: true, message: "Your message has been received." });
    });
};


// Get All Contact Messages (Admin Access)
export const getAllContacts = (req, res) => {
    // Optional: Check if user is admin
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const sql = `
        SELECT c.id, c.name, c.email, c.phone_number, c.comment, c.created_at, u.first_name AS user_first_name
        FROM contact c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.status(200).json({ success: true, contacts: results });
    });
};
// Get Contacts of Logged-In User
export const getUserContacts = (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const sql = "SELECT id, name, email, phone_number, comment, created_at FROM contact WHERE user_id = ? ORDER BY created_at DESC";

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.status(200).json({ success: true, contacts: results });
    });
};
