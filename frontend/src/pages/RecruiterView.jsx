import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Share2, Download, ExternalLink, Award, User, Mail, BookOpen, Code, Loader, ArrowLeft, FileText, CheckCircle, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecruiterView() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(null);

  useEffect(() => {
    fetchStudentProfile();
  }, [studentId]);

  const fetchStudentProfile = async () => {
    try {
      const response = await apiClient.get(`/recruiter/student/${studentId}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Student profile not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    setCopying(true);
    const shareLink = `${window.location.origin}/recruiter-view/${studentId}`;
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopying(false), 2000);
  };

  const handleShare = async () => {
    const shareLink = `${window.location.origin}/recruiter-view/${studentId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.student?.name}'s Achievement Portfolio`,
          text: `Check out ${profile?.student?.name}'s verified achievements and skills`,
          url: shareLink,
        });
        toast.success('Profile shared successfully!');
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile?.student) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 font-light mb-6">This student's profile is not available</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium rounded-xl hover:from-orange-700 hover:to-orange-600 transition duration-300"
          >
            <ArrowLeft size={16} />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm mb-4 transition duration-300"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900">Achievement Portfolio</h1>
              <p className="text-sm text-gray-600 font-light mt-1">{profile.student.name} - {profile.student.department}</p>
            </div>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium rounded-xl hover:from-orange-700 hover:to-orange-600 transition duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
            >
              <Share2 size={16} />
              {copying ? 'Copied!' : 'Share Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Student Information Card */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8 shadow-lg hover:shadow-xl transition duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side - Student Info */}
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">{profile.student.name}</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <BookOpen size={18} className="text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Roll Number</p>
                    <p className="font-light">{profile.student.rollNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Code size={18} className="text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</p>
                    <p className="font-light">{profile.student.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={18} className="text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</p>
                    <p className="font-light">{profile.student.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="flex flex-col justify-center">
              <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl p-6 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <Award className="w-8 h-8 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">Verified</span>
                </div>
                <p className="text-4xl font-light text-gray-900 mb-1">{profile.totalCertifiedActivities}</p>
                <p className="text-sm text-gray-600 font-light uppercase tracking-wider">Verified Achievements</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-6">
                <p className="text-sm text-blue-600 font-semibold mb-2 uppercase tracking-wider">Skills Summary</p>
                <div className="space-y-2">
                  <p className="text-2xl font-light text-gray-900">{profile.skills.technical.length}</p>
                  <p className="text-xs text-gray-600 font-light">Technical Skills Demonstrated</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Overview Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-light text-gray-900 mb-6 flex items-center gap-3">
            <Code className="w-8 h-8 text-orange-600" />
            Skills & Capabilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Technical Skills */}
            {profile.skills.technical.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-orange-400 transition duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Code size={20} className="text-orange-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Technical Skills</h4>
                  <span className="ml-auto text-sm font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    {profile.skills.technical.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.technical.map(skill => (
                    <span
                      key={skill}
                      className="bg-orange-100 text-orange-700 text-xs px-3 py-2 rounded-full font-medium hover:bg-orange-200 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            {profile.skills.soft.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-orange-400 transition duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Soft Skills</h4>
                  <span className="ml-auto text-sm font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {profile.skills.soft.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.soft.map(skill => (
                    <span
                      key={skill}
                      className="bg-gray-100 text-gray-700 text-xs px-3 py-2 rounded-full font-medium hover:bg-gray-200 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tools & Technologies */}
            {profile.skills.tools.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-orange-400 transition duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Code size={20} className="text-orange-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Tools & Tech</h4>
                  <span className="ml-auto text-sm font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    {profile.skills.tools.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.tools.map(tool => (
                    <span
                      key={tool}
                      className="bg-orange-50 text-orange-600 text-xs px-3 py-2 rounded-full font-medium hover:bg-orange-100 transition"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Certified Activities & Certificates */}
        <div>
          <h3 className="text-3xl font-light text-gray-900 mb-6 flex items-center gap-3">
            <Award className="w-8 h-8 text-orange-600" />
            Verified Achievements & Certificates
          </h3>

          {profile.activities.length > 0 ? (
            <div className="space-y-6">
              {profile.activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-orange-400 transition duration-300"
                >
                  {/* Activity Header */}
                  <div className="bg-gradient-to-r from-orange-50 to-white border-b-2 border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                            Achievement #{index + 1}
                          </span>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">Verified</span>
                        </div>
                        <h4 className="text-2xl font-semibold text-gray-900 mb-2">{activity.title}</h4>
                        <p className="text-gray-600 font-light leading-relaxed">{activity.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b-2 border-gray-100">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Category</p>
                        <p className="text-sm text-gray-900 font-medium">{activity.category}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Achievement Level</p>
                        <p className="text-sm text-gray-900 font-medium">{activity.achievementLevel || 'College'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Event Date</p>
                        <p className="text-sm text-gray-900 font-medium">
                          {new Date(activity.eventDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Organizing Body</p>
                        <p className="text-sm text-gray-900 font-medium">{activity.organizingBody || 'Institute'}</p>
                      </div>
                    </div>

                    {/* Skills for this activity */}
                    {(activity.technicalSkills?.length > 0 || activity.softSkills?.length > 0) && (
                      <div className="mb-6 pb-6 border-b-2 border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Skills Demonstrated</p>
                        <div className="space-y-3">
                          {activity.technicalSkills?.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-600 font-medium mb-2">Technical</p>
                              <div className="flex flex-wrap gap-2">
                                {activity.technicalSkills.map(skill => (
                                  <span key={skill} className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {activity.softSkills?.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-600 font-medium mb-2">Soft Skills</p>
                              <div className="flex flex-wrap gap-2">
                                {activity.softSkills.map(skill => (
                                  <span key={skill} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-12 text-center shadow-lg">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg text-gray-600 font-light">No verified achievements yet</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
              <QrCode className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">AchievR</p>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                All achievements displayed here have been verified by institution faculty and certified by Admin.
              </p>
              <p className="text-xs text-gray-500 font-light mt-3">
                Generated by AchievR (built by Shashank & Omkar)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

