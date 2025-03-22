import { useEffect, useState, useContext } from "react";
import { fetchJobs, addJob, updateJob, deleteJob } from "../api/jobApi";
import toast from 'react-hot-toast'; // This gives us access to toast.success() and toast.error()
import AuthContext from "./context/AuthContext"; // ✅ Import Auth Context
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";



function App() {
  const { user, logout } = useContext(AuthContext); // ✅ Get the logged-in user & logout function
  const [showLogin, setShowLogin] = useState(false); // default to SignUp
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
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
    return showLogin ? (
      <Login onSwitch={() => setShowLogin(false)} />
    ) : (
      <SignUp onSwitch={() => setShowLogin(true)} />
    );
  }
  

  // ✅ Add Job (Now sends the user's token)
  const handleAddJob = async () => {
    if (!newJob.company || !newJob.position) return;
  
    const token = user.token; // ✅ Get token from context/localStorage
    const addedJob = await addJob(newJob, token); // ✅ Send to API
  
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-6">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          📌 Job Tracker
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Add Job Form */}
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add New Job</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Company"
            value={newJob.company}
            onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-1/2 focus:ring focus:ring-blue-200 text-gray-700"
          />
          <input
            type="text"
            placeholder="Position"
            value={newJob.position}
            onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-1/2 focus:ring focus:ring-blue-200 text-gray-700"
          /> 
        </div>
        <button
          onClick={handleAddJob}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 rounded-md transition"
        >
          ➕ Add Job
        </button>
      </div>

      {/* Sorting & Filtering */}
      <div className="flex gap-2 mb-6 w-full max-w-2xl justify-center">
        {["All", "Applied", "Interview", "Offer", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              handleFilter(tab === "All" ? "" : tab);
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-sm
              ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="w-full max-w-2xl space-y-4">
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center">No jobs added yet.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white p-4 shadow-md rounded-xl">
              {editingJob && editingJob.id === job.id ? (
                <div className="space-y-2">
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
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleUpdateJob}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md w-full"
                    >
                      ✅ Save
                    </button>
                    <button
                      onClick={() => setEditingJob(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md w-full"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{job.position}</h3>
                    <p className="text-gray-600 text-sm">{job.company} ({job.status})</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingJob(job)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-3 py-1 rounded-md"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-md"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
