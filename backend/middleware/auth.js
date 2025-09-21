import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        // Extract token from cookies
        const token = req.cookies.token; 
        
        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id; // Attach user ID to request body
        next(); // Proceed to next middleware/controller

    } catch (err) {
        console.error("Auth Error:", err);
        return res.status(401).json({ success: false, message: "Invalid or Expired Token" });
    }
};

export default authMiddleware;
