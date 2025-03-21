import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // ✅ Extract token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // ✅ Fix: Store only the user ID as a number
    next();
  } catch (error) {
    console.error("JWT Error:", error.message); // Debugging
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
