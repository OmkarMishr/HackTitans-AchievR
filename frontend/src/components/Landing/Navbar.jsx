import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import achievrLogo from "../../assets/achievr-logo.png";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const goToDashboard = () => {
    if (!user) return navigate("/login");
    const path =
      user.role === "student" ? "/dashboard" : `/${user.role}`;
    navigate(path);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={achievrLogo}
            alt="AchievR"
            className="h-8 sm:h-10"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Dashboard */}
          <button
            onClick={goToDashboard}
            title="Dashboard"
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <LayoutDashboard size={20} className="text-gray-600" />
          </button>

          {user ? (
            <div className="relative">

              {/* Profile */}
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition"
              >
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-semibold">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>

                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.name}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition ${dropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">

                  {/* User details */}
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 break-all">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-2">

                    <button
                      onClick={goToDashboard}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </button>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition">
                      <LogOut size={16} />
                      Logout
                    </button>

                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition">
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}