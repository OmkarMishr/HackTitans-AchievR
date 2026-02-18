import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import achievrLogo from "../../assets/achievr-logo.png";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleDashboardClick = () => {
    if (user) {
      const route = user.role === "student" ? "/dashboard" : `/${user.role}`;
      navigate(route);
    } else navigate("/login");
  };

  return (
    <nav className="fixed w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex justify-between items-center">
        
        <img
          src={achievrLogo}
          alt="AchievR"
          className="h-12 md:h-16 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="flex items-center gap-4 md:gap-8">
          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={handleDashboardClick}
          >
            Dashboard
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 md:px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-sm shadow-lg"
              >
                <User size={16} />
                {user.name}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border">
                  <div className="p-3 border-b">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <button
                    onClick={handleDashboardClick}
                    className="w-full text-left px-4 py-2 hover:bg-orange-50"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex gap-2"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 md:px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}