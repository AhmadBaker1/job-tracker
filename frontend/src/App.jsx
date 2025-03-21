import { useEffect, useState, useContext } from "react";
import { fetchJobs, addJob, updateJob, deleteJob } from "../api/jobApi";
import toast from 'react-hot-toast'; // This gives us access to toast.success() and toast.error()
import AuthContext from "./context/AuthContext"; // ✅ Import Auth Context
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";



function App() {
  const { user, logout } = useContext(AuthContext); // ✅ Get the logged-in user & logout function
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [newJob, setNewJob] = useState({ company: "", position: "", status: "Applied", notes: "" });
  const [editingJob, setEditingJob] = useState(null);

  // ✅ Fetch jobs when the user logs in
  useEffect(() => {
    if (user) {
      const loadJobs = async () => {
        const token = user.token; // ✅ Get token from user
        const data = await fetchJobs(token); // ✅ Pass token to API
        setJobs(data);
        setAllJobs(data);
      };

      loadJobs();
    }
  }, [user]);

  // ✅ Redirect to login page if no user is logged in
  if (!user) {
    return <Login />;
  }

  // ✅ Add Job (Now sends the user's token)
  const handleAddJob = async () => {
    if (!newJob.company || !newJob.position) return;
  
    const token = user.token;
    const addedJob = await addJob(newJob, token); // ✅ Pass token to API
    if (addedJob) {
      setJobs([...jobs, addedJob]);
      setAllJobs([...allJobs, addedJob]);
      setNewJob({ company: "", position: "", status: "Applied", notes: "" });
      toast.success("Job added successfully!");
    } else {
      toast.error("Failed to add job. Please try again.");
    }
  };

  // ✅ Update Job (Now sends the user's token)
  const handleUpdateJob = async () => {
    if (!editingJob.company || !editingJob.position) return;
  
    const token = user.token;
    const updatedJob = await updateJob(editingJob.id, editingJob, token); // ✅ Pass token to API
    if (updatedJob) {
      setJobs(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
      setAllJobs(allJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
      setEditingJob(null);
      toast.success("Job updated successfully!");
    } else {
      toast.error("Failed to update job. Please try again.");
    }
  };

  // ✅ Delete Job (Now sends the user's token)
  const handleDeleteJob = async (id) => {
    const token = user.token;
    const success = await deleteJob(id, token); // ✅ Pass token to API
    if (success) {
      setJobs(jobs.filter((job) => job.id !== id));
      setAllJobs(allJobs.filter((job) => job.id !== id));
      toast.success("Job deleted successfully!");
    } else {
      toast.error("Failed to delete job. Please try again.");
    }
  };

  // ✅ Filter Jobs by Status
  const handleFilter = (status) => {
    if (status === "") {
      setJobs(allJobs);
    } else {
      setJobs(allJobs.filter((job) => job.status === status));
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6 text-gray-700">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        📌 <span>Job Tracker</span>
      </h1>

      {/* ✅ Add Logout Button */}
      <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md">
        Logout
      </button>

      {/* Add Job Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add New Job</h2>
        <input
          type="text"
          placeholder="Company"
          value={newJob.company}
          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
          className="border border-gray-300 rounded-md p-2 w-full mb-3 focus:ring focus:ring-blue-200 text-gray-700"
        />
        <input
          type="text"
          placeholder="Position"
          value={newJob.position}
          onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
          className="border border-gray-300 rounded-md p-2 w-full mb-3 focus:ring focus:ring-blue-200 text-gray-700"
        />
        <button
          onClick={handleAddJob}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md w-full flex items-center justify-center gap-2"
        >
          ➕ Add Job
        </button>
      </div>

      {/* Sorting & Filtering */}
<div className="flex justify-between w-full max-w-lg mt-4">
  {/* Sorting */}
  <select
    onChange={(e) => setJobs([...jobs].sort((a, b) => a[e.target.value].localeCompare(b[e.target.value])))}
    className="border border-gray-300 rounded-md p-2 text-gray-700"
  >
    <option value="company">Sort by Company</option>
    <option value="position">Sort by Position</option>
    <option value="status">Sort by Status</option>
  </select>

  {/* Filtering */}
  <select
  onChange={(e) => handleFilter(e.target.value)}
  className="border border-gray-300 rounded-md p-2 text-gray-700"
>
  <option value="">Show All</option>
  <option value="Applied">Applied</option>
  <option value="Interview">Interview</option>
  <option value="Offer">Offer</option>
  <option value="Rejected">Rejected</option>
</select>
</div>

{/* Job List */}
<div className="w-full max-w-lg mt-6">
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No jobs added yet.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center">
                {editingJob && editingJob.id === job.id ? (
                  <div className="flex flex-col gap-2 w-full">
                    <input
                      type="text"
                      value={editingJob.company}
                      onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                      className="border border-gray-300 rounded-md p-2 w-full text-gray-700"
                    />
                    <input
                      type="text"
                      value={editingJob.position}
                      onChange={(e) => setEditingJob({ ...editingJob, position: e.target.value })}
                      className="border border-gray-300 rounded-md p-2 w-full text-gray-700"
                    />
                    <select
                      value={editingJob.status}
                      onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value })}
                      className="border border-gray-300 rounded-md p-2 w-full text-gray-700"
                    >
                      <option>Applied</option>
                      <option>Interview</option>
                      <option>Offer</option>
                      <option>Rejected</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateJob}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md w-full"
                      >
                        ✅ Save
                      </button>
                      <button
                        onClick={() => setEditingJob(null)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-md w-full"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="block text-lg font-semibold">{job.position}</span>
                    <span className="text-gray-600">{job.company} ({job.status})</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingJob(job)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-3 py-1 rounded-md"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-md"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  
  );
}

export default App;
