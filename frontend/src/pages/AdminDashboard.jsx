import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Award, CheckCircle, FileCheck, Loader } from 'lucide-react';

export default function AdminDashboard({ user }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certifying, setCertifying] = useState(null);

  useEffect(() => {
    fetchApprovedActivities();
  }, []);

  const fetchApprovedActivities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/activities/admin/approved', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setActivities(response.data.activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (activityId) => {
    setCertifying(activityId);
    try {
      await axios.post(
        `http://localhost:5000/api/certificates/generate/${activityId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('✅ Certificate generated successfully!');
      fetchApprovedActivities();
    } catch (error) {
      console.error('Certificate generation error:', error);
      alert('❌ Error generating certificate');
    } finally {
      setCertifying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-5xl font-light text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 font-light mt-1">Manage and certify approved activities</p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-400 transition duration-300 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-50 rounded-xl">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-light mb-1">Activities Ready for Certification</p>
                  <p className="text-4xl font-light text-gray-900">{activities.length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 font-light uppercase tracking-wider">Total Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Table */}
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden hover:border-orange-400 transition duration-300">
          <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-light text-gray-900">Approved Activities</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student Name</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Activity Title</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Level</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="p-4 bg-green-50 rounded-full mb-4">
                          <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <p className="text-lg text-gray-700 font-light">All activities have been certified!</p>
                        <p className="text-sm text-gray-600 font-light mt-2">No pending certifications at the moment.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  activities.map((activity, index) => (
                    <tr 
                      key={activity._id} 
                      className={`border-b border-gray-200 hover:bg-orange-50 transition duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{activity.student?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-600 font-light mt-1">{activity.student?.email || 'N/A'}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{activity.title}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                          {activity.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {activity.achievementLevel || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleGenerateCertificate(activity._id)}
                          disabled={certifying === activity._id}
                          className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 transition duration-300 font-medium text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 disabled:shadow-none rounded-lg"
                        >
                          {certifying === activity._id ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Certifying...
                            </>
                          ) : (
                            <>
                              <Award className="w-4 h-4" />
                              Generate Certificate
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Info Section */}
        {activities.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Certificate Generation</p>
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  Certificates are blockchain-secured and include QR codes for instant verification. 
                  Each certificate is permanently recorded and tamper-proof.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
