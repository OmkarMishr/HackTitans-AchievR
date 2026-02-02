import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GraduationCap, Mail, Lock, User, BookOpen, Code, AlertCircle } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    rollNumber: "",
    department: "",
    year: "4",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      
      <div className="hidden md:flex w-1/2 bg-orange-50 items-center justify-center px-12">
        <div>
          <h1 className="text-5xl font-bold text-gray-900">
            Join <span className="text-orange-600">AchievR</span>
          </h1>
          <p className="text-gray-600 mt-4 text-lg max-w-md">
            Build your verified portfolio in minutes.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Create Account
          </h2>
          <p className="text-gray-600 text-center text-sm mt-1">
            Start verifying achievements today
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4 flex gap-2">
              <AlertCircle className="text-red-600" size={18} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold flex gap-1 items-center">
                  <User size={15} className="text-orange-600" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold flex gap-1 items-center"> <Mail size={15} className="text-orange-600" /> Email </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold flex gap-1 items-center">
                  <Lock size={15} className="text-orange-600" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold flex gap-1 items-center">
                  <Code size={15} className="text-orange-600" />
                  Role
                </label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white" >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {formData.role === "student" && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold flex gap-1 items-center">
                    <BookOpen size={15} className="text-orange-600" />
                    Roll No
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="BIT2021001"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  >
                    <option value="1">1st</option>
                    <option value="2">2nd</option>
                    <option value="3">3rd</option>
                    <option value="4">4th</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold flex gap-1 items-center">
                    <Code size={15} className="text-orange-600" />
                    Dept
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="CSE"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition" >
              <GraduationCap size={18} />
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-5 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600 font-semibold hover:underline" >
              Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}