const API_URL = 'http://localhost:5000/jobs'; // URL of the API

// Fetch all jobs
export const fetchJobs = async () => {
    try {
        const response = await fetch(API_URL); // Sends a GET request
        return await response.json(); // Converts response to JSON
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return []; // Returns an empty list if there's an error
    }
};

// Add a new job 
export const addJob = async (job) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST', // HTTP method is POST
            headers: {
                'Content-Type': 'application/json', // Tells server we're sending JSON
            },
            body: JSON.stringify(job), // Converts job object into a JSON string
        });
        return await response.json(); // Returns the newly added job
    } catch (error) {
        console.error("Error adding job:", error);
        return null; // Return null in case of error
    }
};

// Update a job
export const updateJob = async (id, job) => {
    if (!id) {
      console.error("Error: Trying to update a job with undefined ID.");
      return null;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
export const deleteJob = async (id) => {
    if (!id) {
      console.error("Error: Trying to delete a job with an undefined ID.");
      return false;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: "DELETE",
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
  