import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  UserPlus,
  Trophy,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { registerUser } from "../services/authService";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    rollNumber: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 bg-white">

      {/* LEFT SIDE — COOL PREMIUM BRAND */}
<div className="hidden md:flex flex-col justify-center px-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

  <h1 className="text-5xl font-bold mb-6">
    Join <span className="text-orange-500">AchievR</span>
  </h1>

  <p className="text-slate-300 text-lg mb-10 max-w-md">
    Turn your event participation into verified digital proof. Get instant certificates and build a recruiter-ready portfolio.
  </p>

  <div className="space-y-6">

    <div className="flex items-center gap-3">
      <div className="bg-orange-500/15 p-2 rounded-lg">
        <Trophy className="text-orange-400" />
      </div>
      <span className="text-slate-200">Showcase verified achievements &  participation</span>
    </div>

    <div className="flex items-center gap-3">
      <div className="bg-orange-500/15 p-2 rounded-lg">
        <ShieldCheck className="text-orange-400" />
      </div>
      <span className="text-slate-200">Get instant digital certificates</span>
    </div>

    <div className="flex items-center gap-3">
      <div className="bg-orange-500/15 p-2 rounded-lg">
        <Sparkles className="text-orange-400" />
      </div>
      <span className="text-slate-200">Build your recruiter-ready professional portfolio</span>
    </div>

  </div>
</div>


      {/* RIGHT SIDE — FORM */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Create Account
          </h2>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex gap-2">
              <AlertCircle className="text-red-600" size={18} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>

            {/* Role */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>

            {/* Student Fields */}
            {formData.role === "student" && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="rollNumber"
                  placeholder="Roll Number"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleChange}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account..." : (
                <>
                  <UserPlus size={18} />
                  Register
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}