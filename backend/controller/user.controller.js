import db from "../config/db.js";





// ✅ Get All Users
export const getAllUsers = (req, res) => {
    db.query("SELECT id, first_name, last_name, email, created_at FROM users", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.status(200).json({ success: true, users: results });
    });
};

// ✅ Get User by ID
export const getUserById = (req, res) => {
    const { id } = req.params;

    db.query("SELECT id, first_name, last_name, email, created_at FROM users WHERE id = ?", [id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user: results[0] });
    });
};

// ✅ Update User by ID
export const updateUser = (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email } = req.body;

    db.query("UPDATE users SET first_name = ?, last_name = ?,email = ? WHERE id = ?", [first_name, last_name, email, id], (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "User update failed" });
        }

        res.status(200).json({ success: true, message: "User updated successfully" });
    });
};

// ✅ Delete User by ID
export const deleteUser = (req, res) => {
  const id = req.params.id;


  
  // First delete related reviews
  db.query("DELETE FROM reviews WHERE user_id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting reviews:", err);
      return res.status(500).json({ success: false, message: "Failed to delete related reviews" });
    }  
})

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ success: false, message: "Server error while deleting user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  });
};

