const API_URL = 'https://job-tracker-backend-6c2x.onrender.com/api/jobs'; // URL of the API

// 🔐 Helper to get token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

// ✅ Fetch all jobs
export const fetchJobs = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

// Add a new job 
export const addJob = async (job, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log("📦 Sending headers:", headers); // 👈 Add this

    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(job),
    });

    console.log("🚀 Response status:", response.status);
    return await response.json();
  } catch (error) {
    console.error("Error adding job:", error);
    return null;
  }
};

// Update a job
export const updateJob = async (id, job, token) => {
  if (!id) {
    console.error("Error: Trying to update a job with undefined ID.");
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`, // ✅ Add this
      },
      body: JSON.stringify(job),
    });

    if (!response.ok) {
      console.error("Failed to update job:", response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating job:", error);
    return null;
  }
};
  

// Delete a job
export const deleteJob = async (id, token) => {
  if (!id) {
    console.error("Error: Trying to delete a job with an undefined ID.");
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`, // ✅ Add this
      },
    });

    if (!response.ok) {
      console.error("Failed to delete job:", response.statusText);
      return false;
    }

    console.log("Job Deleted Successfully:", id);
    return true;
  } catch (error) {
    console.error("Error deleting job:", error);
    return false;
  }
};
  