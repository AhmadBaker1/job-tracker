import pkg from "pg"; // Import PostgreSQL package
import dotenv from "dotenv"; // Load environment variables

dotenv.config(); // Load .env variables

const { Pool } = pkg; // Get Pool from pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ✅ Uses your Render DB
  ssl: {
    rejectUnauthorized: false, // ✅ Needed for Render's PostgreSQL
  },
});

export default pool; // ✅ Export it so you can import in jobRoutes.js
