import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Download, TrendingUp, Award, Clock, AlertCircle, Zap, GraduationCap, Share2, X, Copy, ExternalLink, Code, User, Mail, BookOpen, QrCode, CheckCircle, FileText, Loader, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentDashboard({ user }) {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    certified: 0,
    pending: 0,
    rejected: 0,
    skillsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [certificateDetailsOpen, setCertificateDetailsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await apiClient.get('/activities/my-activities', {
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
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSharePortfolio = async () => {
    setPreviewLoading(true);
    try {
      const response = await apiClient.get(`/recruiter/my-profile`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      setPreviewData(response.data);
      setPreviewOpen(true);
      toast.success('Portfolio preview loaded!');
    } catch (error) {
      console.error('Error loading preview:', error);
      toast.error('Failed to load portfolio preview');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleCopyLink = () => {
    const shareLink = previewData?.shareableLink || `${window.location.origin}/recruiter-view/${user?.id}`;
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard!');
  };

  const handleOpenInNewTab = () => {
    const shareLink = previewData?.shareableLink || `${window.location.origin}/recruiter-view/${user?.id}`;
    window.open(shareLink, '_blank');
  };

  const handleShare = async () => {
    const shareLink = previewData?.shareableLink || `${window.location.origin}/recruiter-view/${user?.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.name}'s Achievement Portfolio`,
          text: `Check out ${user?.name}'s verified achievements and skills on AchievR`,
          url: shareLink,
        });
        toast.success('Portfolio shared successfully!');
        setPreviewOpen(false);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.log('Share cancelled');
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleViewCertificateDetails = (certificate) => {
    setSelectedCertificate(certificate);
    setCertificateDetailsOpen(true);
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const certificationRate = stats.total > 0 ? Math.round((stats.certified / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-light text-gray-900 mb-3">Your Achievement Portfolio</h1>
              <p className="text-gray-600 font-light mt-2">Track, certify, and showcase your accomplishments</p>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Share Portfolio Button */}
              <button
                onClick={handleSharePortfolio}
                disabled={previewLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold rounded-xl transition duration-300 hover:border-orange-700 hover:text-orange-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {previewLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Share2 size={18} />
                    <span>Share Portfolio</span>
                  </>
                )}
              </button>

              {/* Add Achievement Button */}
              <button
                onClick={() => navigate('/submit')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl transition duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 group"
              >
                <Plus size={18} className="group-hover:rotate-90 transition duration-300" />
                <span>Add Achievement</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards - Admin Style */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {/* Total Activities */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-light">Total Activities</p>
                <p className="text-4xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="opacity-20 text-6xl">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Certified */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-light">Certified</p>
                <p className="text-4xl font-bold mt-2">{stats.certified}</p>
              </div>
              <div className="opacity-20 text-6xl">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-light">Under Review</p>
                <p className="text-4xl font-bold mt-2">{stats.pending}</p>
              </div>
              <div className="opacity-20 text-6xl">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-light">Rejected</p>
                <p className="text-4xl font-bold mt-2">{stats.rejected}</p>
              </div>
              <div className="opacity-20 text-6xl">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Rate */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-light">Rate</p>
                <p className="text-4xl font-bold mt-2">{certificationRate}%</p>
              </div>
              <div className="opacity-20 text-6xl">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Bar Chart */}
          <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-orange-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  <h3 className="text-2xl font-light text-gray-900">Activities by Category</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-light mt-1">Distribution across different achievement types</p>
            </div>
            <div className="p-8">
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
          </div>

          {/* Pie Chart */}
          <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-orange-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-orange-600" />
                  <h3 className="text-2xl font-light text-gray-900">Verification Status</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-light mt-1">Current submission status overview</p>
            </div>
            <div className="p-8">
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
        </div>

        {/* Activities Table */}
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-light text-gray-900">Your Activities</h2>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full">
                  {activities.length}
                </span>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Skills</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <GraduationCap className="w-12 h-12 text-gray-300" />
                        <p className="text-lg text-gray-700 font-semibold">No activities yet</p>
                        <p className="text-sm text-gray-600">Start by submitting your first achievement</p>
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
                  activities.map((activity, index) => (
                    <tr
                      key={activity._id}
                      className={`border-b border-gray-200 hover:bg-orange-50 transition ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{activity.title}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                          {activity.category}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-700">
                        {new Date(activity.eventDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          activity.status === 'certified'
                            ? 'bg-green-100 text-green-700'
                            : activity.status === 'approved'
                            ? 'bg-blue-100 text-blue-700'
                            : activity.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {activity.selectedTechnicalSkills?.slice(0, 2).map((skill) => (
                            <span key={skill} className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {activity.selectedTechnicalSkills?.length > 2 && (
                            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                              +{activity.selectedTechnicalSkills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {activity.status === 'certified' && activity.qrCodeUrl ? (
                          <a
                            href={activity.qrCodeUrl}
                            download
                            className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 transition rounded-lg text-sm font-bold"
                          >
                            <Download size={14} />
                            Download
                          </a>
                        ) : (
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

      {/* Portfolio Preview Modal */}
      {previewOpen && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Portfolio Preview</h2>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition duration-300"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                {/* Student Info Section */}
                <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-8 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left - Student Info */}
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">{previewData.student.name}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <BookOpen size={18} className="text-orange-600" />
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Roll Number</p>
                            <p className="font-light text-gray-900">{previewData.student.rollNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Code size={18} className="text-orange-600" />
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Department</p>
                            <p className="font-light text-gray-900">{previewData.student.department}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-orange-600" />
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Email</p>
                            <p className="font-light text-gray-900">{previewData.student.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right - Stats */}
                    <div className="flex flex-col justify-center">
                      <div className="bg-white border-2 border-orange-300 rounded-xl p-4 mb-3">
                        <p className="text-xs font-semibold text-orange-600 uppercase mb-1">Verified Achievements</p>
                        <p className="text-4xl font-light text-gray-900">{previewData.totalCertifiedActivities}</p>
                      </div>
                      <div className="bg-white border-2 border-blue-300 rounded-xl p-4">
                        <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Total Skills</p>
                        <p className="text-4xl font-light text-gray-900">
                          {previewData.skills.technical.length + previewData.skills.soft.length + previewData.skills.tools.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                {(previewData.skills.technical.length > 0 || previewData.skills.soft.length > 0 || previewData.skills.tools.length > 0) && (
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Code size={20} className="text-orange-600" />
                      Skills & Capabilities
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Technical Skills */}
                      {previewData.skills.technical.length > 0 && (
                        <div className="bg-white border-2 border-orange-200 rounded-xl p-4">
                          <p className="text-sm font-semibold text-orange-600 mb-3 uppercase">Technical Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {previewData.skills.technical.slice(0, 6).map(skill => (
                              <span key={skill} className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                                {skill}
                              </span>
                            ))}
                            {previewData.skills.technical.length > 6 && (
                              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                                +{previewData.skills.technical.length - 6}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Soft Skills */}
                      {previewData.skills.soft.length > 0 && (
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                          <p className="text-sm font-semibold text-gray-600 mb-3 uppercase">Soft Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {previewData.skills.soft.slice(0, 6).map(skill => (
                              <span key={skill} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                                {skill}
                              </span>
                            ))}
                            {previewData.skills.soft.length > 6 && (
                              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                                +{previewData.skills.soft.length - 6}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tools */}
                      {previewData.skills.tools.length > 0 && (
                        <div className="bg-white border-2 border-orange-200 rounded-xl p-4">
                          <p className="text-sm font-semibold text-orange-600 mb-3 uppercase">Tools & Tech</p>
                          <div className="flex flex-wrap gap-2">
                            {previewData.skills.tools.slice(0, 6).map(tool => (
                              <span key={tool} className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                                {tool}
                              </span>
                            ))}
                            {previewData.skills.tools.length > 6 && (
                              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                                +{previewData.skills.tools.length - 6}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Certificates Issued Section */}
                {previewData.activities.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award size={20} className="text-orange-600" />
                      Certificates Issued ({previewData.activities.length})
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {previewData.activities.map((activity, index) => (
                        <div 
                          key={activity.id}
                          onClick={() => handleViewCertificateDetails(activity)}
                          className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-orange-400 hover:shadow-lg cursor-pointer transition duration-300 group"
                        >
                          {/* Certificate Card Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText size={16} className="text-orange-600" />
                                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                  Certificate #{index + 1}
                                </span>
                              </div>
                              <h5 className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition line-clamp-2">
                                {activity.title}
                              </h5>
                            </div>
                            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                          </div>

                          {/* Certificate Details */}
                          <div className="space-y-2 mb-3 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 font-light">Category:</span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                                {activity.category}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 font-light">Level:</span>
                              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                                {activity.achievementLevel}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 font-light">Certified:</span>
                              <span className="text-green-600 font-semibold">
                                {new Date(activity.certifiedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                              </span>
                            </div>
                          </div>

                          {/* Skills Preview */}
                          {(activity.technicalSkills?.length > 0 || activity.softSkills?.length > 0) && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {activity.technicalSkills?.slice(0, 3).map(skill => (
                                <span key={skill} className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                                  {skill}
                                </span>
                              ))}
                              {(activity.technicalSkills?.length > 3 || activity.softSkills?.length > 0) && (
                                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                  +{(activity.technicalSkills?.length || 0) + (activity.softSkills?.length || 0) - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* View Details Button */}
                          <button className="w-full text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 py-2 rounded-lg transition duration-300">
                            View Certificate Details →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Link Section */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Share Your Portfolio</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 bg-white border-2 border-blue-300 rounded-lg p-3 flex items-center justify-between">
                      <p className="text-xs text-gray-600 font-light truncate">
                        {previewData.shareableLink}
                      </p>
                      <button
                        onClick={handleCopyLink}
                        className="ml-2 p-1 hover:bg-blue-100 rounded transition"
                        title="Copy link"
                      >
                        <Copy size={16} className="text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white p-4 border-t-2 border-gray-200 rounded-b-2xl">
                  <button
                    onClick={handleOpenInNewTab}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold rounded-xl transition duration-300"
                  >
                    <ExternalLink size={16} />
                    View Full Portfolio
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl transition duration-300 shadow-lg shadow-orange-500/30"
                  >
                    <Share2 size={16} />
                    Share Portfolio
                  </button>
                  <button
                    onClick={() => setPreviewOpen(false)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition duration-300"
                  >
                    <X size={16} />
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Details Modal */}
      {certificateDetailsOpen && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-50 to-white border-b-2 border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Certificate Details</h2>
                <button
                  onClick={() => setCertificateDetailsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition duration-300"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                {/* Achievement Title */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Achievement Title</p>
                  <h3 className="text-3xl font-bold text-gray-900">{selectedCertificate.title}</h3>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Description</p>
                  <p className="text-gray-700 font-light leading-relaxed">{selectedCertificate.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Category</p>
                    <p className="text-lg text-gray-900 font-medium">{selectedCertificate.category}</p>
                  </div>

                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Level</p>
                    <p className="text-lg text-gray-900 font-medium">{selectedCertificate.achievementLevel}</p>
                  </div>

                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Event Date</p>
                    <p className="text-lg text-gray-900 font-medium">
                      {new Date(selectedCertificate.eventDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Certified On</p>
                    <p className="text-lg text-gray-900 font-medium">
                      {new Date(selectedCertificate.certifiedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Skills Section */}
                {(selectedCertificate.technicalSkills?.length > 0 || selectedCertificate.softSkills?.length > 0) && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Skills Demonstrated</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCertificate.technicalSkills?.map(skill => (
                        <span key={skill} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                      {selectedCertificate.softSkills?.map(skill => (
                        <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setCertificateDetailsOpen(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
