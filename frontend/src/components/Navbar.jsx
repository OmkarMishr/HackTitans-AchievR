import { useNavigate } from "react-router-dom";
import { LogOut, Plus, FileCheck, Shield, Home, Menu } from "lucide-react";
import { useState } from "react";
import achievrLogo from "../assets/achievr-logo.png";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Top Section */}
        <div className="flex items-center justify-between py-3">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer"
          >
            <img
              src={achievrLogo}
              alt="AchievR"
              className="h-10 sm:h-12 w-auto"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">

            {/* User Info */}
            <div className="text-right pr-4 border-r border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>

            {/* Home */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition"
            >
              <Home size={16} />
              Home
            </button>

            {/* Role-Based Button */}
            {user?.role === "student" && (
              <button
                onClick={() => navigate("/submit")}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700 transition"
              >
                <Plus size={16} />
                Submit Activity
              </button>
            )}

            {user?.role === "faculty" && (
              <button
                onClick={() => navigate("/faculty")}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700 transition"
              >
                <FileCheck size={16} />
                Review
              </button>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700 transition"
              >
                <Shield size={16} />
                Approvals
              </button>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-red-50 hover:text-red-600 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t pt-4 pb-2 space-y-3">

            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>

            <button
              onClick={() => handleNavigate("/")}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100"
            >
              <Home size={16} />
              Home
            </button>

            {user?.role === "student" && (
              <button
                onClick={() => handleNavigate("/submit")}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-orange-600 text-white"
              >
                <Plus size={16} />
                Submit Activity
              </button>
            )}

            {user?.role === "faculty" && (
              <button
                onClick={() => handleNavigate("/faculty")}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-orange-600 text-white"
              >
                <FileCheck size={16} />
                Review
              </button>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => handleNavigate("/admin")}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-orange-600 text-white"
              >
                <Shield size={16} />
                Approvals
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}