
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token User:", decoded); 

        
        req.user = { id: decoded.user_id }; 

        if (!req.user.id) {
            return res.status(400).json({ success: false, message: "Invalid token. User ID missing." });
        }

        next();
    } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid token." });
    }
};





export const admin = (req, res, next) => {
    if (!req.user || req.user.is_admin !== 1) {
        return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
    next();
};
