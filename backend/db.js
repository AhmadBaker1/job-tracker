import pkg from "pg"; // Import PostgreSQL package
import dotenv from "dotenv"; // Load environment variables

dotenv.config(); // Load .env variables

const { Pool } = pkg; // Get Pool from pg

export const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

