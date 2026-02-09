import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Award, CheckCircle, FileCheck, Loader, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certifying, setCertifying] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    certified: 0,
    pending: 0,
    rate: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApprovedActivities();
  }, []);

  const fetchApprovedActivities = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/activities/admin/approved');

      const activitiesList = response.data.activities || [];
      setActivities(activitiesList);

      const certified = activitiesList.filter(a => a.certificateId).length;
      const pending = activitiesList.length - certified;
      const rate = activitiesList.length > 0 ? Math.round((certified / activitiesList.length) * 100) : 0;

      setStats({
        total: activitiesList.length,
        approved: activitiesList.length,
        certified,
        pending,
        rate
      });

    } catch (error) {
      //console.error('Error fetching activities:', error);
      alert('Error loading activities: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (activity) => {
    if (!activity || !activity._id) {
      alert('Invalid activity');
      return;
    }
    setCertifying(activity._id);

    try {
      await apiClient.post(`/certificates/generate/${activity._id}`);
      alert("Certificate Generated Successfully");

      fetchApprovedActivities();

    } catch (error) {
      // console.error(error);
      alert(error.response?.data?.error || "Failed to generate certificate");
    } finally {
      setCertifying(null);
    }
  };

  //filtering
  const filteredActivities = activities
    .filter(a => a?.student)
    .filter(activity => {
      const title = activity.title ? activity.title.toLowerCase() : '';
      const studentName = activity.student?.name ? activity.student.name.toLowerCase() : '';
      return title.includes(searchTerm.toLowerCase()) || studentName.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-12">

        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-5xl font-light text-gray-900 mb-3"> Admin Dashboard</h1>
            <p className="text-gray-600 font-light mt-2">Manage & certify approved activities</p>
          </div>
          <button
            onClick={fetchApprovedActivities}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-400 transition text-2xl font-light text-gray-900">
            <RefreshCw className="w-4 h-4 " /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Activities"
            value={stats.total}
            icon={<FileCheck className="w-6 h-6" />}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            icon={<AlertCircle className="w-6 h-6" />}
            color="from-yellow-500 to-yellow-600"
          />
          <StatCard
            label="Certified"
            value={stats.certified}
            icon={<CheckCircle className="w-6 h-6" />}
            color="from-green-500 to-green-600"
          />
          <StatCard
            label="Rate"
            value={`${stats.rate}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="from-purple-500 to-purple-600"
          />
        </div>

        <div className="mb-6 bg-white p-4 rounded-xl border-2 border-gray-200 flex flex-wrap gap-4">
          <div className="flex-1 min-w-250">
            <input type="text" placeholder=" Search by student or activity..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none font-medium" />
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCheck className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-light text-gray-900">Approved Activities</h2>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full">
                  {filteredActivities.length}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Student</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Activity</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Level</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
                        <p className="text-lg text-gray-700 font-semibold">All activities certified!</p>
                        <p className="text-sm text-gray-600">No pending certifications</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((activity, index) => {
                    return (
                      <tr key={activity._id || index} className={`border-b border-gray-200 hover:bg-orange-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} >
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">{activity.student.name || 'N/A'}</div>
                          <div className="text-xs text-gray-600">{activity.student.email || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900 truncate max-w-xs">{activity.title || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                            {activity.category || 'N/A'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                            {activity.achievementLevel || 'N/A'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${activity.certificateId ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'}`}>
                            {activity.certificateId ? 'Certified' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleGenerateCertificate(activity)}
                            disabled={certifying === activity._id || activity.certificateId}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 transition rounded-lg text-sm font-bold whitespace-nowrap"
                          >
                            {certifying === activity._id ? (
                              <>
                                <Loader className="w-3 h-3 animate-spin" />
                                Sending...
                              </>
                            ) : activity.certificateId ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Done
                              </>
                            ) : (
                              <>
                                <Award className="w-3 h-3" />
                                Generate
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 font-light">{label}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <div className="opacity-20 text-6xl">{icon}</div>
      </div>
    </div>
  );
}