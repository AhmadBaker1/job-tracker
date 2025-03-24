import { useState } from "react";

import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";

const SignUp = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 

  const handleSignUp = async () => {

    console.log("Submitting sign up with:", formData);
    
    try {
      const res = await fetch("https://job-tracker-backend-6c2x.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.success("Account created! Please log in.");
        onSwitch();
        
      } else {
        toast.error(data.message || "Sign up failed");
      }
    } catch (err) {
        toast.error("Something went wrong");
        console.error(err);
    }
};

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
      />
      <input
        type="email"
        name="email"
        placeholder="Email address"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
      />
      <input
        type="password"
        name="password"
        placeholder="Create password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
      />

      <button
        onClick={handleSignUp}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 rounded-lg transition"
      >
        Sign Up
      </button>

      <p className="text-center text-sm mt-5 text-gray-500">
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-blue-600 hover:underline font-medium">
          Log In
        </button>
      </p>

      <div className="flex items-center my-5">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-3 text-gray-400 text-sm">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <button className="w-full border border-gray-300 text-sm py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </div>
  </div>
);
};

export default SignUp;
