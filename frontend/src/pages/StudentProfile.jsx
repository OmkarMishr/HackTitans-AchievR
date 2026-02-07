import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Award, Code, Heart, Wrench, CheckCircle, Loader, Sparkles, TrendingUp } from 'lucide-react';

export default function StudentProfile({ user }) {
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Get all certified activities
      const res = await apiClient.get('/activities/my-activities', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const certifiedActivities = res.data.activities.filter(a => a.status === 'certified');
      setActivities(certifiedActivities);

      // Aggregate all skills
      const allTechnical = new Set();
      const allSoft = new Set();
      const allTools = new Set();

      certifiedActivities.forEach(activity => {
        activity.selectedTechnicalSkills?.forEach(s => allTechnical.add(s));
        activity.selectedSoftSkills?.forEach(s => allSoft.add(s));
        activity.selectedTools?.forEach(t => allTools.add(t));
      });

      setProfile({
        technicalSkills: Array.from(allTechnical),
        softSkills: Array.from(allSoft),
        tools: Array.from(allTools),
        totalActivities: certifiedActivities.length
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-light">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-lg text-gray-600 font-light">No profile data available</p>
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
              <h1 className="text-5xl font-light text-gray-900">Your Skills Profile</h1>
              <p className="text-gray-600 font-light mt-1">Verified achievements and demonstrated capabilities</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-400 transition duration-300 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-50 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-light mb-1">Total Certified Activities</p>
                  <p className="text-4xl font-light text-gray-900">{profile.totalActivities}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-light text-orange-600">{profile.technicalSkills.length}</p>
                    <p className="text-xs text-gray-600 font-light uppercase tracking-wider">Technical</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-light text-orange-600">{profile.softSkills.length}</p>
                    <p className="text-xs text-gray-600 font-light uppercase tracking-wider">Soft Skills</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-light text-orange-600">{profile.tools.length}</p>
                    <p className="text-xs text-gray-600 font-light uppercase tracking-wider">Tools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-6 flex items-center gap-3">
            <Award className="w-8 h-8 text-orange-600" />
            Skills Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TECHNICAL SKILLS */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-400 transition duration-300 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Code className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-light text-gray-900">Technical Skills</h3>
                  <p className="text-xs text-gray-600 font-light">{profile.technicalSkills.length} skills acquired</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.technicalSkills.length > 0 ? (
                  profile.technicalSkills.map(skill => (
                    <span 
                      key={skill} 
                      className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-orange-200 transition"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 font-light">No technical skills yet</p>
                )}
              </div>
            </div>

            {/* SOFT SKILLS */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-400 transition duration-300 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <Heart className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-light text-gray-900">Soft Skills</h3>
                  <p className="text-xs text-gray-600 font-light">{profile.softSkills.length} skills developed</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.softSkills.length > 0 ? (
                  profile.softSkills.map(skill => (
                    <span 
                      key={skill} 
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 font-light">No soft skills yet</p>
                )}
              </div>
            </div>

            {/* TOOLS */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-400 transition duration-300 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Wrench className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-light text-gray-900">Tools & Technologies</h3>
                  <p className="text-xs text-gray-600 font-light">{profile.tools.length} tools mastered</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.tools.length > 0 ? (
                  profile.tools.map(tool => (
                    <span 
                      key={tool} 
                      className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-orange-100 transition"
                    >
                      {tool}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 font-light">No tools yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CERTIFIED ACTIVITIES */}
        <div>
          <h2 className="text-3xl font-light text-gray-900 mb-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-orange-600" />
            Certified Activities
          </h2>

          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div 
                  key={activity._id} 
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-400 hover:shadow-lg transition duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">{activity.title}</h3>
                      <p className="text-sm text-gray-600 font-light leading-relaxed">{activity.description}</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                      {activity.category}
                    </span>
                    {activity.achievementLevel && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {activity.achievementLevel}
                      </span>
                    )}
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      ✓ Certified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-12 text-center">
              <div className="p-4 bg-orange-50 rounded-full mb-4 w-fit mx-auto">
                <Award className="w-12 h-12 text-orange-600" />
              </div>
              <p className="text-lg text-gray-700 font-light mb-2">No Certified Activities Yet</p>
              <p className="text-sm text-gray-600 font-light">
                Start submitting your achievements to build your verified skills profile
              </p>
            </div>
          )}
        </div>

        {/* Bottom Info Card */}
        {activities.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Keep Building Your Profile</p>
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  Every certified activity adds to your verified skills portfolio. 
                  Share your achievements with recruiters and showcase your capabilities with confidence.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
