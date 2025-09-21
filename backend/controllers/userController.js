import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import createToken from "../config/generateToken.js";
import jwt from "jsonwebtoken";

// Register User
const registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        name = name.trim();
        email = email.trim().toLowerCase();

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ name, email, password: hashedPassword });
        await newUser.save();

        const token = createToken(newUser._id);

        // ✅ Send token in HTTP-Only Cookie
        res.cookie("token", token, {
            httpOnly: true, // ✅ Prevent client-side JS access
            secure: process.env.NODE_ENV==="production", // ✅ Secure in production
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ None for prod, Lax for localhost
            maxAge: 60 * 60 * 1000 // ✅ 1 hour expiry
        });

        // ✅ Send user details in the response (excluding password)
        res.status(201).json({ 
            success: true, 
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error("Error in registerUser:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Login User
const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim().toLowerCase();

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        const token = createToken(user._id);

        // ✅ Send token in HTTP-Only Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ None for prod, Lax for localhost
            maxAge: 60 * 60 * 1000
        });

        // ✅ Send user details in the response
        res.status(200).json({ 
            success: true, 
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (err) {
        console.error("Error in loginUser:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Logout User
const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
        });

        res.status(200).json({ success: true, message: "Logout successful" });

    } catch (err) {
        console.error("Error in logoutUser:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const getUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }
        res.status(200).json({ success: true, user: req.user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export { registerUser, loginUser, logoutUser,getUser  };
