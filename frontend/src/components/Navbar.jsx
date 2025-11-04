import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, FileCheck, Shield, Home } from 'lucide-react';
import achievrLogo from '../assets/achievr-logo.png';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-8 py-0">
        <div className="flex justify-between items-center">
          {/* Logo/Brand - Clickable to Home */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition duration-300 group"
            title="Go to Home"
          >
            <img 
              src={achievrLogo} 
              alt="AchievR Logo" 
              className="h-22 w-auto hover:scale-105 transition duration-300 group-hover:drop-shadow-lg"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* User Info */}
            <div className="text-right border-r border-gray-200 pr-4 md:pr-6">
              <div className="text-sm font-medium text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-600 capitalize font-light mt-0.5">{user?.role}</div>
            </div>

            {/* Home Button - Visible on Desktop */}
            <button
              onClick={() => navigate('/')}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-gray-700 border-2 border-gray-300 hover:border-orange-600 hover:text-orange-600 hover:bg-orange-50 transition duration-300 font-medium text-sm rounded-lg"
              title="Go to Home"
            >
              <Home size={16} />
              Home
            </button>

            {/* Role-Based Action Button */}
            {user?.role === 'student' && (
              <button
                onClick={() => navigate('/submit')}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 transition duration-300 font-medium text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 rounded-lg"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Submit Activity</span>
                <span className="sm:hidden">Submit</span>
              </button>
            )}

            {user?.role === 'faculty' && (
              <button
                onClick={() => navigate('/faculty')}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 transition duration-300 font-medium text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 rounded-lg"
              >
                <FileCheck size={16} />
                <span className="hidden sm:inline">Review Activities</span>
                <span className="sm:hidden">Review</span>
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 transition duration-300 font-medium text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 rounded-lg"
              >
                <Shield size={16} />
                <span className="hidden sm:inline">Approvals</span>
                <span className="sm:hidden">Admin</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 md:px-6 py-2 border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition duration-300 font-medium text-sm rounded-lg"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
