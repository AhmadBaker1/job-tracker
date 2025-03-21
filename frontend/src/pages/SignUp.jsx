import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import useNavigate from "react-router-dom";
import toast from "react-hot-toast";

const SignUp = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok) {
            login(data); // Store token in context
            toast.success("Account created! Redirecting...");
            navigate("/"); // Redirect to Job Tracker
        } else {
            toast.error(data.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Create an Account</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="border p-2 w-full rounded" required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border p-2 w-full rounded" required />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
