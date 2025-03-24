import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobRoutes.js'; // ✅ No curly braces for default export
import authRoutes from "./routes/authRoutes.js"; // ✅ No curly braces for default export
import pool from "./db.js";



dotenv.config(); // Load environment variables from .env file

// Testing database connection
pool.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((err) => console.error('Error connecting to PostgreSQL database:', err));

const app = express(); // Create an Express app
app.use(cors({
    origin: 'https://job-tracker-cyan.vercel.app', // ✅ Your Vercel frontend URL
    credentials: true 
  }));
app.use(express.json()); // for API requests
app.use('/api/jobs', jobRoutes);
app.use("/api/auth", authRoutes); // Use auth routes

// Test Route using (GET /)
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "Job Tracker API is running...", time: result.rows[0] });
    } catch (err) {
        console.error("Database error:", err.stack);
        res.status(500).json({ message: "Database Connection Error" });
    }
})

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Adding a Route to Create a New Job using (POST /jobs)
app.post('/jobs', async (req, res) => {
    const { company, position, status, notes } = req.body; // Extracts company, position, status, notes from the request body

    if (!company || !position || !status) {
        return res.status(400).json({ error: "Company, Position, and Status are required"});
    }

    try {
        const result = await pool.query(
        `INSERT INTO jobs (company, position, status, notes) VALUES ($1, $2, $3, $4) RETURNING *`,
        [company, position, status, notes]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to add job"});
    }
});

// Adding a Route to Get All Jobs using (GET /jobs)
app.get('/jobs', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM jobs ORDER BY date_applied DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching jobs", error);
        res.status(500).json({ error: "Failed to retrieve jobs"});
    }
});

// Adding a Route to Update a Job using (PUT /jobs/:id)
app.put('/jobs/:id', async (req, res) => {
    const { id } = req.params; // Extracts job ID from the request URL
    const { company, position, status, notes } = req.body; // Extracts updated fields from req.body
    
    try {
        const result = await pool.query(
            "UPDATE jobs SET company=$1, position=$2, status=$3, notes=$4 WHERE id=$5 RETURNING *",
            [company, position, status, notes, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Job not found"});
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ error: "Failed to update job"});
    }
});

// Adding a Route to Delete a Job using (DELETE /jobs/:id)
app.delete("/jobs/:id", async (req, res) => {
    const { id } = req.params; // Extracts job ID from the request URL

    try {
        const result = await pool.query("DELETE FROM jobs WHERE id=$1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Job not found"});
        }

        res.json({ message: "Job deleted successfully", deletedJob: result.rows[0] });
    } catch (error) {
        console.error("Error deleting job", error);
        res.status(500).json({ error: "Failed to delete job"});
    }
});

