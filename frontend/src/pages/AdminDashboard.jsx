import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Award, CheckCircle, FileCheck, Loader, Send, Eye } from 'lucide-react';

export default function AdminDashboard({ user }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certifying, setCertifying] = useState(null);
  const [certificateData, setCertificateData] = useState(null);

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

  // ========== GENERATE CERTIFICATE ==========
  const handleGenerateCertificate = async (activity) => {
    setCertifying(activity._id);
    try {
      console.log('📜 Step 1: Generating certificate...');

      const response = await axios.post(
        `http://localhost:5000/api/certificates/generate/${activity._id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      console.log('✅ Certificate generated:', response.data);
      setCertificateData(response.data);

      // Show confirmation
      const confirmSend = window.confirm(
        `✅ Certificate generated!\n\nSend to: ${response.data.studentEmail}?\n\nClick OK to send email.`
      );

      if (confirmSend) {
        // Proceed to send email
        await handleSubmitAndSendEmail(activity._id, response.data);
      }

    } catch (error) {
      console.error('❌ Certificate generation error:', error);
      alert('❌ Error: ' + error.response?.data?.error);
    } finally {
      setCertifying(null);
    }
  };

  // ========== SUBMIT CERTIFICATE & SEND EMAIL ==========
  const handleSubmitAndSendEmail = async (activityId, certData) => {
    setCertifying(activityId);
    try {
      console.log('\n📧 Step 2: Submitting certificate and sending email...');
      console.log('Certificate Data:', certData);

      const response = await axios.post(
        `http://localhost:5000/api/certificates/submit/${activityId}`,
        {
          certificateId: certData.certificateId,
          certificatePath: certData.certificatePath,
          studentName: certData.studentName,
          studentEmail: certData.studentEmail,
          studentId: certData.studentId,
          achievement: certData.achievement,
          organizingBody: certData.organizingBody,
          achievementLevel: certData.achievementLevel,
          eventDate: certData.eventDate,
          description: certData.description
        },
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('✅ Email sent successfully:', response.data);
      alert(`✅ Certificate sent to ${certData.studentEmail}`);
      
      setCertificateData(null);
      fetchApprovedActivities(); // Refresh list

    } catch (error) {
      console.error('❌ Email sending error:', error);
      alert('❌ Error: ' + error.response?.data?.error);
    } finally {
      setCertifying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white font-sans">
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
              <h1 className="text-5xl font-light text-gray-900">👨‍💼 Admin Dashboard</h1>
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

        {/* Certificate Data Modal */}
        {certificateData && (
          <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">📜 Certificate Preview</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-blue-700 font-semibold">Student</p>
                    <p className="text-blue-900">{certificateData.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 font-semibold">Email</p>
                    <p className="text-blue-900">{certificateData.studentEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 font-semibold">Certificate ID</p>
                    <p className="text-blue-900 font-mono text-xs">{certificateData.certificateId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 font-semibold">Achievement</p>
                    <p className="text-blue-900">{certificateData.achievement}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => window.open(certificateData.certificatePath, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-4"
              >
                <Eye size={16} /> View PDF
              </button>
            </div>
          </div>
        )}

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
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
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
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          activity.certificateId 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {activity.certificateId ? '✅ Certified' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleGenerateCertificate(activity)}
                          disabled={certifying === activity._id || activity.certificateId}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 transition duration-300 font-medium text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 disabled:shadow-none rounded-lg whitespace-nowrap"
                        >
                          {certifying === activity._id ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Certifying...
                            </>
                          ) : activity.certificateId ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Certified ✓
                            </>
                          ) : (
                            <>
                              <Award className="w-4 h-4" />
                              Generate & Send
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
                <p className="text-sm font-medium text-gray-900 mb-1">📜 Certificate Generation & Email</p>
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  Click "Generate & Send" to create a certificate and automatically send it via email.
                  Each certificate includes a QR code for instant verification. Students receive the PDF directly in their email.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}