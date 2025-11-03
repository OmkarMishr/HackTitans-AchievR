import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Plus, Download, TrendingUp, Award, Clock, AlertCircle, Zap, GraduationCap } from 'lucide-react';

export default function StudentDashboard() {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    certified: 0,
    pending: 0,
    rejected: 0,
    skillsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/activities/my-activities', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setActivities(response.data.activities);

      const certified = response.data.activities.filter(a => a.status === 'certified').length;
      const pending = response.data.activities.filter(a => a.status === 'pending').length;
      const rejected = response.data.activities.filter(a => a.status === 'rejected').length;

      setStats({
        total: response.data.activities.length,
        certified,
        pending,
        rejected,
        skillsCount: new Set(
          response.data.activities.flatMap(a => [...(a.selectedTechnicalSkills || []), ...(a.selectedSoftSkills || [])])
        ).size
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Technical', count: activities.filter(a => a.category === 'Technical').length },
    { name: 'Sports', count: activities.filter(a => a.category === 'Sports').length },
    { name: 'Cultural', count: activities.filter(a => a.category === 'Cultural').length },
    { name: 'Leadership', count: activities.filter(a => a.category === 'Leadership').length },
    { name: 'Others', count: activities.filter(a => !['Technical', 'Sports', 'Cultural', 'Leadership'].includes(a.category)).length }
  ].filter(item => item.count > 0);

  const statusData = [
    { name: 'Certified', value: stats.certified, color: '#10B981' },
    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
    { name: 'Rejected', value: stats.rejected, color: '#EF4444' }
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-white to-orange-50">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <GraduationCap size={48} className="text-orange-600 mx-auto" />
          </div>
          <p className="text-2xl font-bold text-gray-900">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  const certificationRate = stats.total > 0 ? Math.round((stats.certified / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/20 to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Header */}
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">Your Achievement Portfolio</h1>
            <p className="text-xl text-gray-600 font-medium">Track, certify, and showcase your accomplishments</p>
          </div>
          <button
            onClick={() => navigate('/submit')}
            className="hidden md:flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 group"
          >
            <Plus size={22} className="group-hover:rotate-90 transition duration-300" />
            Add Achievement
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          {/* Total Activities */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-orange-400 transition duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl group-hover:scale-110 transition duration-300">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.total}</div>
            <p className="text-sm font-semibold text-gray-600">Total Activities</p>
          </div>

          {/* Certified */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-green-400 transition duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl group-hover:scale-110 transition duration-300">
                <Award size={24} className="text-green-600" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">{certificationRate}%</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.certified}</div>
            <p className="text-sm font-semibold text-gray-600">Certified</p>
          </div>

          {/* Pending */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-yellow-400 transition duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl group-hover:scale-110 transition duration-300">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">Review</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.pending}</div>
            <p className="text-sm font-semibold text-gray-600">Under Review</p>
          </div>

          {/* Rejected */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-red-400 transition duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-xl group-hover:scale-110 transition duration-300">
                <AlertCircle size={24} className="text-red-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.rejected}</div>
            <p className="text-sm font-semibold text-gray-600">Rejected</p>
          </div>

          {/* Unique Skills */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-purple-400 transition duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl group-hover:scale-110 transition duration-300">
                <Zap size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.skillsCount}</div>
            <p className="text-sm font-semibold text-gray-600">Unique Skills</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Bar Chart */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Activities by Category</h3>
                <p className="text-sm text-gray-600 font-medium mt-1">Distribution across different achievement types</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <TrendingUp size={24} className="text-orange-600" />
              </div>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '14px', fontWeight: '600' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '14px', fontWeight: '600' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #F97316',
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}
                  />
                  <Bar dataKey="count" fill="#F97316" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500 font-semibold">
                No activities to display
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Verification Status</h3>
                <p className="text-sm text-gray-600 font-medium mt-1">Current submission status overview</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <Award size={24} className="text-orange-600" />
              </div>
            </div>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #F97316',
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500 font-semibold">
                No status data to display
              </div>
            )}
          </div>
        </div>

        {/* Activities Table */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          
          {/* Table Header */}
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Activities</h2>
              <p className="text-sm text-gray-600 font-medium mt-1">Manage and track all your submissions</p>
            </div>
            <button
              onClick={() => navigate('/submit')}
              className="md:hidden flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
            >
              <Plus size={18} />
              Add
            </button>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-900">Title</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-900">Category</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-900">Date</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-900">Skills</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <GraduationCap size={48} className="text-gray-300" />
                        <p className="text-gray-600 font-semibold text-lg">No activities yet</p>
                        <p className="text-gray-500 font-medium mb-4">Start by submitting your first achievement</p>
                        <button
                          onClick={() => navigate('/submit')}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl transition duration-300 shadow-lg hover:shadow-orange-500/50"
                        >
                          <Plus size={18} />
                          Submit Achievement
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity._id} className="border-b border-gray-100 hover:bg-orange-50/50 transition duration-300 group">
                      <td className="px-8 py-6 font-bold text-gray-900 group-hover:text-orange-600 transition">{activity.title}</td>
                      <td className="px-8 py-6">
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg text-sm">
                          {activity.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-medium text-gray-700">
                        {new Date(activity.eventDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold transition duration-300 ${
                          activity.status === 'certified' 
                            ? 'bg-green-100 text-green-700' :
                          activity.status === 'approved' 
                            ? 'bg-blue-100 text-blue-700' :
                          activity.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {activity.selectedTechnicalSkills?.slice(0, 2).map((skill) => (
                            <span key={skill} className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-lg">
                              {skill}
                            </span>
                          ))}
                          {activity.selectedTechnicalSkills?.length > 2 && (
                            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-lg">
                              +{activity.selectedTechnicalSkills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {activity.status === 'certified' && activity.qrCodeUrl && (
                          <a 
                            href={activity.qrCodeUrl} 
                            download 
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold hover:underline transition duration-300"
                          >
                            <Download size={16} />
                            Download
                          </a>
                        )}
                        {activity.status !== 'certified' && (
                          <span className="text-gray-400 font-medium text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Styles */}
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