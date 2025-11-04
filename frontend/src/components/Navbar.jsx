import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, FileCheck, Shield } from 'lucide-react';
import achievrLogo from '../assets/achievr-logo.png';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition duration-300"
            
          >
            <img 
              src={achievrLogo} 
              alt="AchievR Logo" 
              className="h-18 w-auto hover:scale-105 transition duration-300"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            {/* User Info */}
            <div className="text-right border-r border-gray-200 pr-6">
              <div className="text-sm font-medium text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-600 capitalize font-light mt-0.5">{user?.role}</div>
            </div>

            {/* Role-Based Action Button */}
            {user.role === 'student' && (
              <button
                onClick={() => navigate('/submit')}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 transition duration-300 font-medium text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
              >
                <Plus size={16} />
                Submit Activity
              </button>
            )}

            {user.role === 'faculty' && (
              <button
                onClick={() => navigate('/review')}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 transition duration-300 font-medium text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
              >
                <FileCheck size={16} />
                Review Activities
              </button>
            )}

            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/approvals')}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 transition duration-300 font-medium text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
              >
                <Shield size={16} />
                Approvals
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-6 py-2 border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition duration-300 font-medium text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
