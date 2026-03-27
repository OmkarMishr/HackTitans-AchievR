import { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/apiClient';
import {
  User,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Loader,
  FileText,
  AlertCircle,
  Download,
  Eye,
  Printer,
  TrendingUp,
} from 'lucide-react';
import Footer from '../components/Footer';

export default function FacultyDashboard() {
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatingCert, setGeneratingCert] = useState(false);

  useEffect(() => {
    fetchPendingActivities();
  }, []);

  const fetchPendingActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login.');
        return;
      }

      const [pendingResponse, allResponse] = await Promise.all([
        apiClient.get('/activities/faculty/pending'),
        apiClient.get('/activities/admin/all'),
      ]);

      const pendingActivities = pendingResponse.data.activities || [];
      const totalActivities = allResponse.data.activities || [];

      setActivities(pendingActivities);
      setAllActivities(totalActivities);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (activityId) => {
    if (!activityId) {
      alert('Activity ID is missing');
      return;
    }

    if (!comment.trim()) {
      alert('Please add a comment before approving');
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token missing. Please login again.');
        return;
      }

      await apiClient.put(`/activities/${activityId}/approve`, { comment });

      alert('Activity approved successfully!');
      setSelectedActivity(null);
      setComment('');
      await fetchPendingActivities();
    } catch (error) {
      console.error('Error approving activity:', error.message);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (activityId, reason) => {
    if (!activityId) {
      alert('Activity ID is missing');
      return;
    }

    if (!reason.trim()) {
      alert('Please add a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token missing. Please login again.');
        return;
      }

      await apiClient.put(`/activities/${activityId}/reject`, { reason });

      alert('Activity rejected!');
      setSelectedActivity(null);
      await fetchPendingActivities();
    } catch (error) {
      console.error('Error rejecting activity:', error.message);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateCertificate = async (activityId) => {
    if (!activityId) {
      alert('Activity ID is missing');
      return;
    }

    setGeneratingCert(true);
    try {
      await apiClient.post(`/certificates/generate/${activityId}`);
      alert("Certificate generated successfully!");
      await fetchPendingActivities();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to generate certificate");
    } finally {
      setGeneratingCert(false);
    }
  };

  const handleViewCertificate = (certificateId) => {
    if (!certificateId) {
      alert("Certificate ID not found");
      return;
    }

    const baseURL = import.meta.env.VITE_API_URL;
    window.open(`${baseURL}/certificates/verify/${certificateId}`, '_blank');
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const response = await apiClient.get(`/certificates/download/${certificateId}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to download certificate");
    }
  };

  const stats = useMemo(() => {
    const pending = activities.length;

    const approved = allActivities.filter(
      (a) => a.status === 'approved' || a.status === 'certified'
    ).length;

    const rejected = allActivities.filter(
      (a) => a.status === 'rejected'
    ).length;

    const certified = allActivities.filter(
      (a) => a.certificateId
    ).length;

    return {
      total: allActivities.length,
      pending,
      approved,
      rejected,
      certified,
    };
  }, [activities, allActivities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white px-4">
        <div className="text-center">
          <Loader className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-base sm:text-lg text-gray-600 font-light">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-6 sm:py-8 lg:py-12">

        <div className="mb-8 sm:mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 break-words">
              Faculty Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Review, approve & generate certificates
            </p>
          </div>

          
        </div>

        {/* Stats Section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg sm:text-xl font-light text-gray-900">Activity Overview</h2>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4">
            <StatCard
              label="Total Activities"
              value={stats.total}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              color="from-yellow-500 to-yellow-600"
            />
            <StatCard
              label="Approved"
              value={stats.approved}
              color="from-green-500 to-green-600"
            />
            <StatCard
              label="Rejected"
              value={stats.rejected}
              color="from-red-500 to-red-600"
            />
            <StatCard
              label="Certified"
              value={stats.certified}
              color="from-purple-500 to-purple-600"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-red-700 text-sm sm:text-base">{error}</p>
            <button
              onClick={fetchPendingActivities}
              className="text-red-600 font-medium text-left sm:text-right"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl sm:text-2xl font-light text-gray-900">Pending Activities</h2>
            </div>

            {activities.length === 0 ? (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 sm:p-12 text-center">
                <div className="p-4 bg-green-50 rounded-full mb-4 w-fit mx-auto">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                </div>
                <p className="text-base sm:text-lg text-gray-700 font-light">All caught up!</p>
                <p className="text-sm text-gray-600 font-light mt-2">No pending activities to review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity._id}
                    onClick={() => {
                      setSelectedActivity(activity);
                      setComment('');
                    }}
                    className={`bg-white p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition duration-300 hover:shadow-lg ${
                      selectedActivity?._id === activity._id
                        ? 'border-orange-400 bg-orange-50 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base sm:text-lg text-gray-900 mb-2 break-words">
                          {activity.title}
                        </h3>
                        <div className="space-y-1">
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="font-light break-words">
                              {activity.student?.name || 'Unknown'}
                              <span className="text-gray-500"> ({activity.student?.rollNumber || 'N/A'})</span>
                            </span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="font-light">
                              {activity.eventDate ? new Date(activity.eventDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {selectedActivity?._id === activity._id && (
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-medium rounded-full self-start">
                          Selected
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        {activity.category}
                      </span>
                      {activity.achievementLevel && (
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {activity.achievementLevel}
                        </span>
                      )}
                      {activity.certificateId && (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Certified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-6">
            {selectedActivity ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl sm:text-2xl font-light text-gray-900">Review Activity</h2>
                </div>

                <div className="space-y-4">
                  {/* Activity Details */}
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-orange-400 transition duration-300">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Title</p>
                        <p className="text-gray-900 font-light break-words">{selectedActivity.title}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Student</p>
                        <p className="text-gray-900 font-light break-words">{selectedActivity.student?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-600 font-light break-words">{selectedActivity.student?.rollNumber || 'N/A'}</p>
                        <p className="text-sm text-gray-600 font-light break-all">{selectedActivity.student?.email || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Description</p>
                        <p className="text-sm text-gray-700 font-light leading-relaxed max-h-32 overflow-y-auto break-words">
                          {selectedActivity.description}
                        </p>
                      </div>

                      {selectedActivity.organizingBody && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Organizing Body</p>
                          <p className="text-gray-900 font-light break-words">{selectedActivity.organizingBody}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Event Date</p>
                        <p className="text-gray-900 font-light">
                          {selectedActivity.eventDate
                            ? new Date(selectedActivity.eventDate).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Proof Documents Section */}
                  {selectedActivity?.proofDocuments &&
                  Array.isArray(selectedActivity.proofDocuments) &&
                  selectedActivity.proofDocuments.length > 0 ? (
                    <div className="bg-white border-2 border-blue-200 rounded-xl p-4 sm:p-6 hover:border-blue-400 transition duration-300 bg-blue-50">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <p className="text-sm font-semibold text-blue-900 uppercase tracking-wider">
                            Proof Documents ({selectedActivity.proofDocuments.length})
                          </p>
                        </div>

                        <div className="space-y-2">
                          {selectedActivity.proofDocuments.map((doc, index) => {
                            const baseURL = import.meta.env.VITE_API_URL.replace('/api', '');
                            const url = doc.url || doc.path;
                            const fullUrl = url
                              ? (url.startsWith('http') ? url : `${baseURL}${url.startsWith('/') ? url : '/' + url}`)
                              : null;

                            return (
                              <div
                                key={index}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-md transition"
                              >
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 break-words">
                                      {doc.filename || `Document ${index + 1}`}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                    {doc.fileSize && (
                                      <p className="text-xs text-gray-500">
                                        Size: {(doc.fileSize / 1024).toFixed(2)} KB
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:ml-4">
                                  <button
                                    onClick={() => {
                                      if (fullUrl) {
                                        window.open(fullUrl, '_blank');
                                      } else {
                                        alert('Document URL not available');
                                      }
                                    }}
                                    className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                    title="View Document"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (fullUrl) {
                                        window.location.href = fullUrl;
                                      } else {
                                        alert('Document URL not available');
                                      }
                                    }}
                                    className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                                    title="Download Document"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                          <p className="text-xs text-blue-700 font-medium">
                            ℹ️ Review these proof documents before approving the activity
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Skills Section */}
                  {(selectedActivity.selectedTechnicalSkills?.length > 0 ||
                    selectedActivity.selectedSoftSkills?.length > 0 ||
                    selectedActivity.selectedTools?.length > 0) && (
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-orange-400 transition duration-300">
                      <div className="space-y-3">
                        {selectedActivity.selectedTechnicalSkills?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Technical Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedActivity.selectedTechnicalSkills.map((skill) => (
                                <span
                                  key={`tech-${skill}`}
                                  className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedActivity.selectedSoftSkills?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Soft Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedActivity.selectedSoftSkills.map((skill) => (
                                <span
                                  key={`soft-${skill}`}
                                  className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedActivity.selectedTools?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Tools & Technologies</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedActivity.selectedTools.map((tool) => (
                                <span
                                  key={`tool-${tool}`}
                                  className="bg-orange-50 text-orange-600 text-xs px-3 py-1 rounded-full font-medium"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Certificate Section */}
                  {selectedActivity.status === 'approved' ? (
                    <div className="bg-white border-2 border-green-200 rounded-xl p-4 sm:p-6 hover:border-green-400 transition duration-300 bg-green-50">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">Status</p>
                          <p className="text-sm text-green-700 font-medium">Approved & Ready</p>
                        </div>

                        {selectedActivity.certificateId ? (
                          <>
                            <div className="border-t border-green-200 pt-3">
                              <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">
                                Certificate Generated
                              </p>
                              <div className="space-y-2">
                                <button
                                  onClick={() => handleViewCertificate(selectedActivity.certificateId)}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                >
                                  <Eye size={16} />
                                  View Certificate
                                </button>
                                <button
                                  onClick={() => handleDownloadCertificate(selectedActivity.certificateId)}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                                >
                                  <Download size={16} />
                                  Download PDF
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <button
                            onClick={() => handleGenerateCertificate(selectedActivity._id)}
                            disabled={generatingCert}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 transition text-sm font-medium"
                          >
                            {generatingCert ? (
                              <>
                                <Loader size={16} className="animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Printer size={16} />
                                Generate Certificate with QR
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-orange-400 transition duration-300">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Review Comment *</p>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add your review comment..."
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-light text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition duration-300 h-24 resize-none"
                        />
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => handleApprove(selectedActivity._id)}
                          disabled={actionLoading || !comment.trim()}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 transition duration-300 font-medium text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 disabled:shadow-none rounded-xl"
                        >
                          {actionLoading ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Approve Activity
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:');
                            if (reason) handleReject(selectedActivity._id, reason);
                          }}
                          disabled={actionLoading}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50 disabled:border-gray-300 disabled:text-gray-400 disabled:bg-gray-100 transition duration-300 font-medium text-sm rounded-xl"
                        >
                          {actionLoading ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Reject Activity
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl sm:text-2xl font-light text-gray-900">Review Activity</h2>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-8 sm:p-12 text-center">
                  <div className="p-4 bg-orange-50 rounded-full mb-4 w-fit mx-auto">
                    <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" />
                  </div>
                  <p className="text-base sm:text-lg text-gray-700 font-light mb-2">No Activity Selected</p>
                  <p className="text-sm text-gray-600 font-light">
                    Select an activity from the list to review and approve
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} text-white rounded-xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition min-w-0`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm opacity-90 font-light break-words">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 break-words">{value}</p>
        </div>
      </div>
    </div>
  );
}