import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("🔐 Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("⛔ No Bearer token found.");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔑 Token extracted:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🧾 Token decoded:", decoded);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    console.error("❌ JWT Error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
