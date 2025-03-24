import express from 'express';
import pool from '../db.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ 1️⃣ Fetch jobs for the logged-in user
router.get('/jobs', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Fix here
        const jobs = await pool.query("SELECT * FROM jobs WHERE user_id = $1", [userId]);
        res.json(jobs.rows);
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ 2️⃣ Add a job (linked to the logged-in user)
router.post('/jobs', authenticateToken, async (req, res) => {
    console.log("🔥 Inside POST /jobs");
    console.log("🧑‍💻 req.user:", req.user);
    const userId = req.user.id;
    try {
      
      const { company, position, status, notes } = req.body;
  
      console.log("➡️ Creating job for user ID:", userId);
  
      const newJob = await pool.query(
        "INSERT INTO jobs (company, position, status, date_applied, notes, user_id) VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *",
        [company, position, status, notes, userId]
      );
  
      console.log("✅ Job inserted:", newJob.rows[0]);
      res.json(newJob.rows[0]);
    } catch (err) {
      console.error("❌ Error adding job:", err);
      res.status(500).json({ message: "Server error" });
    }
  });


// ✅ 3️⃣ Update a job (only by the job owner)
router.put('/jobs/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;  // Extract job ID
        const { company, position, status, notes } = req.body;
        const userId = req.user.id;

        // 🔍 Debug logs
        console.log("Decoded User ID from Token:", req.user.id);
        console.log("Extracted userId for update:", userId);
        console.log("Job ID from URL:", id);

        const updatedJob = await pool.query(
            "UPDATE jobs SET company = $1, position = $2, status = $3, notes = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
            [company, position, status, notes, id, userId]
        );

        console.log("Updated Job Result:", updatedJob.rows);

        if (updatedJob.rows.length === 0) {
            return res.status(403).json({ message: "Unauthorized to update this job" });
        }

        res.json(updatedJob.rows[0]);
    } catch (err) {
        console.error("Error updating job:", err);
        res.status(500).json({ message: "Server error" });
    }
});


// ✅ 4️⃣ Delete a job (only by the job owner)
router.delete('/jobs/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deletedJob = await pool.query(
            "DELETE FROM jobs WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        );

        if (deletedJob.rows.length === 0) {
            return res.status(403).json({ message: "Unauthorized to delete this job" });
        }

        res.json({ message: "Job deleted successfully" });
    } catch (err) {
        console.error("Error deleting job:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
