import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Share2, Download, ExternalLink, Award, User, Mail, BookOpen, Code, Loader, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecruiterView() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    fetchStudentProfile();
  }, [studentId]);

  const fetchStudentProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/recruiter/student/${studentId}`
      );
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
    setCopying(false);
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
      {/* Header with Back Button */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm mb-4 transition duration-300"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-light text-gray-900">Achievement Portfolio</h1>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium rounded-xl hover:from-orange-700 hover:to-orange-600 transition duration-300 shadow-lg shadow-orange-500/20"
            >
              <Share2 size={16} />
              {copying ? 'Copied!' : 'Share Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Student Information */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-2">{profile.student.name}</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-600">
                  <BookOpen size={16} className="text-orange-600" />
                  <span className="font-light">{profile.student.rollNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Code size={16} className="text-orange-600" />
                  <span className="font-light">{profile.student.department}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={16} className="text-orange-600" />
                  <span className="font-light">{profile.student.email}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-light text-orange-600 mb-2">{profile.totalCertifiedActivities}</div>
              <p className="text-sm text-gray-600 font-light uppercase tracking-wider">Verified Achievements</p>
            </div>
          </div>
        </div>

        {/* Skills Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Technical Skills */}
          {profile.skills.technical.length > 0 && (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:border-orange-400 transition duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Code size={20} className="text-orange-600" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.technical.map(skill => (
                  <span
                    key={skill}
                    className="bg-orange-100 text-orange-700 text-xs px-3 py-2 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {profile.skills.soft.length > 0 && (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:border-orange-400 transition duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-gray-600" />
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.soft.map(skill => (
                  <span
                    key={skill}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-2 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools */}
          {profile.skills.tools.length > 0 && (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:border-orange-400 transition duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Code size={20} className="text-orange-600" />
                Tools & Tech
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.tools.map(tool => (
                  <span
                    key={tool}
                    className="bg-orange-50 text-orange-600 text-xs px-3 py-2 rounded-full font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certified Activities */}
        <div>
          <h3 className="text-3xl font-light text-gray-900 mb-6 flex items-center gap-3">
            <Award className="w-8 h-8 text-orange-600" />
            Verified Achievements
          </h3>

          {profile.activities.length > 0 ? (
            <div className="space-y-6">
              {profile.activities.map(activity => (
                <div
                  key={activity.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-orange-400 transition duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-2xl font-semibold text-gray-900 mb-2">{activity.title}</h4>
                      <p className="text-gray-600 font-light mb-4 leading-relaxed">{activity.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Category</p>
                          <p className="text-sm text-gray-900 font-medium">{activity.category}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Level</p>
                          <p className="text-sm text-gray-900 font-medium">{activity.achievementLevel || 'N/A'}</p>
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
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Certified</p>
                          <p className="text-sm text-green-600 font-semibold">✓ Verified</p>
                        </div>
                      </div>

                      {/* Skills for this activity */}
                      <div className="space-y-3">
                        {activity.technicalSkills?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Technical Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {activity.technicalSkills.map(skill => (
                                <span key={skill} className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {activity.softSkills?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Soft Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {activity.softSkills.map(skill => (
                                <span key={skill} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* QR Code Download */}
                    {activity.qrCodeUrl && (
                      <div className="flex-shrink-0 ml-6">
                        <a
                          href={activity.qrCodeUrl}
                          download
                          className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium rounded-xl hover:from-orange-700 hover:to-orange-600 transition duration-300 shadow-lg shadow-orange-500/20"
                        >
                          <Download size={16} />
                          Certificate
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-12 text-center">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg text-gray-600 font-light">No verified achievements yet</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Award className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">All certificates are blockchain-verified</p>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                Each achievement has been validated by AchievR's AI system and verified by institution faculty. All certificates include cryptographic verification and cannot be forged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
