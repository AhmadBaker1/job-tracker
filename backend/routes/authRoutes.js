import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { pool } from "../db.js";

const router = express.Router();

// ✅ Register a new user
router.post(
    "/register",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Check if user already exists
            const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            if (userExists.rows.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Save user in DB
            const newUser = await pool.query(
                "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
                [name, email, hashedPassword]
            );

            // Generate JWT Token
            const newUserData = newUser.rows[0];
            const token = jwt.sign(
                { userId: newUserData.id }, // ✅ Correct reference
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
              );

              res.json({ user: { id: newUserData.id, name, email }, token });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
    
);

// ✅ User Login Route
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

            if (user.rows.length === 0) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.rows[0].password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.json({ user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email }, token });
        } catch (error) {
            console.error("Error logging in user:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

import authMiddleware from "../middleware/authMiddleware.js";

// ✅ Protected Route Example
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [req.user]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.rows[0]);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});


export default router;
