import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import achievrLogo from "../../assets/achievr-logo.png";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    closeDropdown();
  };

  const goToDashboard = () => {
    if (!user) return navigate("/login");
    const path = user.role === "student" ? "/dashboard" : `/${user.role}`;
    navigate(path);
    closeDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[99999] bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate("/")}
          >
            <img src={achievrLogo} alt="AchievR" className="h-7 sm:h-10" />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5 sm:gap-4">

            {/* Dashboard icon */}
            <button
              onClick={goToDashboard}
              title="Dashboard"
              className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 transition text-gray-700"
            >
              <LayoutDashboard size={18} />
            </button>

            {/* Verify - icon only on mobile, text on sm+ */}
            <button
              onClick={() => navigate("/verify")}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all"
            >
              <ShieldCheck size={15} />
              <span className="hidden sm:inline">Verify</span>
            </button>

            {user ? (
              <div ref={dropdownRef} className="relative">
                {/* Profile button - compact on mobile */}
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-2xl hover:shadow-lg hover:border-gray-300 transition-all duration-200"
                >
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center text-xs sm:text-sm font-bold shadow-md flex-shrink-0">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  {/* Name hidden on mobile */}
                  <span className="hidden md:block text-sm font-semibold text-gray-900 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-500 transition-transform flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown - full width on mobile */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 sm:w-72 bg-white border border-gray-200 rounded-2xl z-[999999]"
                    style={{ boxShadow: "0 35px 70px rgba(0,0,0,0.15)" }}
                  >
                    {/* User info */}
                    <div className="p-4 border-b border-gray-100 bg-orange-50/40 rounded-t-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="p-3 space-y-1">
                      <button onClick={goToDashboard} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-900 text-sm font-medium">
                        <LayoutDashboard size={17} className="text-orange-500" /> Dashboard
                      </button>
                      <button onClick={() => { navigate("/verify"); closeDropdown(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-900 text-sm font-medium">
                        <ShieldCheck size={17} className="text-orange-500" /> Verify Certificate
                      </button>
                      <div className="h-px bg-gray-100 mx-2" />
                      <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 border border-red-100 transition text-red-600 text-sm font-medium">
                        <LogOut size={17} /> Logout
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-3 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-14 sm:h-16" />
    </>
  );
}