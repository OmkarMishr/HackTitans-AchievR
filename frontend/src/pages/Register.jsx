import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, User, BookOpen, Code, AlertCircle } from "lucide-react";
import achievrLogo from "../assets/achievr-logo.png";



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



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");



    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
        rollNumber: "",
        department: "",
        year: "4",
      });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-white overflow-hidden relative font-sans">



      {/* Animated Background Blobs */}
      <motion.div
        className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-orange-100 to-transparent rounded-full blur-3xl opacity-40"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl opacity-30"
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />



      {/* Centered Content */}
      <div className="min-h-screen flex items-center justify-center px-8 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white border-2 border-gray-100 rounded-2xl p-10 shadow-2xl hover:shadow-3xl transition duration-300 relative"
          >
            {/* Card Gradient Overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 to-orange-500 rounded-t-2xl" />



            {/* Form Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-10"
            >
              
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600 font-medium text-lg">Join AchievR and start verifying your achievements</p>
            </motion.div>



            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6 flex items-start gap-3"
              >
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 font-semibold text-sm">{error}</p>
              </motion.div>
            )}



            {/* Registration Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-5"
            >
              {/* Name Field */}
              <div className="relative group">
                <label className="block text-gray-900 font-bold mb-3 flex items-center gap-2">
                  <User size={18} className="text-orange-600" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition duration-300"
                  required
                />
              </div>



              {/* Email Field */}
              <div className="relative group">
                <label className="block text-gray-900 font-bold mb-3 flex items-center gap-2">
                  <Mail size={18} className="text-orange-600" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition duration-300"
                  required
                />
              </div>



              {/* Password Field */}
              <div className="relative group">
                <label className="block text-gray-900 font-bold mb-3 flex items-center gap-2">
                  <Lock size={18} className="text-orange-600" />
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition duration-300"
                  required
                />
                <p className="text-xs text-gray-500 font-medium mt-2">Min. 8 characters recommended</p>
              </div>



              {/* Role Selection */}
              <div className="relative group">
                <label className="block text-gray-900 font-bold mb-3 flex items-center gap-2">
                  <Code size={18} className="text-orange-600" />
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition duration-300 bg-white cursor-pointer"
                >
                  <option value="student"> Student</option>
                  <option value="faculty"> Faculty</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>



              {/* Student-Specific Fields */}
              {formData.role === "student" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5 pt-2 border-t-2 border-gray-100"
                >
                  {/* Roll Number */}
                  <div className="relative group">
                    <label className="block text-gray-900 font-bold mb-3 flex items-center gap-2">
                      <BookOpen size={18} className="text-orange-600" />
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      placeholder="e.g., BIT2021001"
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition duration-300"
                      required
                    />
                  </div>



                  {/* Department */}
                  <div className="relative group">
                    <label className="block text-gray-900 font-bold mb-3 flex items-center gap-2">
                      <Code size={18} className="text-orange-600" />
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Computer Science"
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition duration-300"
                      required
                    />
                  </div>



                  {/* Year */}
                  <div className="relative group">
                    <label className="block text-gray-900 font-bold mb-3">Academic Year *</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition duration-300 bg-white cursor-pointer"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </motion.div>
              )}



              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-8 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition duration-300 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin">
                      <GraduationCap size={20} />
                    </div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <GraduationCap size={20} />
                    Create My Account
                  </>
                )}
              </motion.button>
            </motion.form>



            {/* Footer */}
            <motion.div
              className="mt-8 pt-8 border-t border-gray-100 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-700 font-medium mb-3">
                Already have an account?
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold text-lg group transition duration-300"
              >
                Login here
                <span className="group-hover:translate-x-1 transition duration-300">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>



      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
