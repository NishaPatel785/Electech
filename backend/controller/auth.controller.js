import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config();

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Register User
export const registerUser = async (req, res) => {
    console.log("Received Body:", req.body); // Debugging

    const { first_name, last_name, email, password ,is_admin} = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            if (results.length > 0) {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }

            console.log("Password before hashing:", password); // Debugging

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            console.log("Hashed Password:", hashedPassword); // Debugging

            const sql = "INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES (?, ?, ?, ?,?)";
            db.query(sql, [first_name, last_name, email, hashedPassword,is_admin || 0], (err, result) => {
                if (err) return res.status(500).json({ success: false, message: err.message });

                // 🔥 Generate JWT Token after successful registration
                const token = jwt.sign({ user_id: result.insertId }, process.env.JWT_SECRET, { expiresIn: "1d" });

                res.status(201).json({
                    success: true,
                    message: "User registered successfully",
                    token, // ✅ Return the token
                    user: {
                        id: result.insertId,
                        first_name,
                        last_name,
                        email,
                        is_admin
                    }
                });
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// ✅ Login User
export const loginUser = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (results.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                is_admin:user.is_admin
            }
        });
    });
};


export const forgotPassword = (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10); 

    db.query("UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?", [otp, expiryTime, email], (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Email not found" });
        }

        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}. It is valid for 10 minutes.`
        });

        res.status(200).json({ success: true, message: "OTP sent successfully" });
    });
};

export const verifyOtpLogin = (req, res) => {
    const { email, otp } = req.body;

    db.query("SELECT id, first_name, last_name, email, otp, otp_expiry FROM users WHERE email = ?", [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid email or OTP" });
        }

        const user = results[0];

        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

       
        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        
        db.query("UPDATE users SET otp = NULL, otp_expiry = NULL WHERE email = ?", [email]);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });
    });
};


export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    db.query("SELECT * FROM users WHERE email = ? AND otp = ?", [email, otp], async (err, results) => {
        if (results.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        const user = results[0];
        const now = new Date();

        if (now > new Date(user.otp_expiry)) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        db.query("UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?", [hashedPassword, email], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            res.status(200).json({ success: true, message: "Password reset successfully" });
        });
    });
};

