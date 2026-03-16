import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Calendar, MapPin, Users, Award, Share2, ExternalLink, CheckCircle } from 'lucide-react';
import achievrLogo from '../assets/achievr-logo.png';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function RecruiterPortfolio() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/recruiter/profile/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Profile not found');
        return res.json();
      })
      .then(data => {
        setPortfolio(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) return <LoadingState />;

  if (error || !portfolio?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShieldCheck className="w-7 h-7 text-orange-600" />
          </div>
          <h1 className="text-xl font-medium text-gray-900 mb-2">Portfolio Not Found</h1>
          <p className="text-gray-700 font-normal text-sm mb-8 leading-relaxed">
            This profile doesn't exist or has no verified achievements.
          </p>
          <Link
            to="/"
            className="text-sm text-white border border-gray-200 hover:border-gray-300 bg-orange-600 px-6 py-2.5 rounded-lg transition-all shadow-sm"
          >
            Back to AchievR
          </Link>
        </div>
      </div>
    );
  }

  const { stats, student, topSkills, timeline } = portfolio;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <img src={achievrLogo} alt="AchievR" className="h-8 sm:h-10  w-auto" />
          </Link>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-600 hover:bg-orange-600 border border-gray-200 text-white font-normal rounded-lg transition-all"
          >
            <Share2 size={14} />
            {copied ? 'Copied!' : 'Share Profile'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-10">

        {/* Student Identity */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-orange-600 mb-3">{student.name}</h1>
              <div className="flex flex-wrap items-center gap-2 text-[#071A2F]">
                <span className="font-mono text-normal">
                  {student.rollNumber} |
                </span>
                <span className="text-normal capitalize">
                  {student.department} |
                </span>
                <span className="text-normal">
                  Batch of {student.year}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-center">
              <div>
                <p className="text-2xl font-semibold text-[#071A2F]">{stats.totalCertificates}</p>
                <p className="text-xs text-gray-800 font-normal mt-0.5">Certificates</p>
              </div>
            </div>

          </div>
        </div>

        {/* Skills */}
        {topSkills.technical.length > 0 && (
          <section>
            <div className="flex items-center gap-2 text-gray-700 text-xs uppercase tracking-widest mb-4 font-normal">
              <Award size={13} />
              Mastered Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {topSkills.technical.map((skill) => (
                <span
                  key={skill}
                  className="text-sm bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all cursor-default font-light shadow-sm"
                >
                  {skill}
                </span>
              ))}
              {topSkills.tools.map((skill) => (
                <span
                  key={skill}
                  className="text-sm bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all cursor-default font-light shadow-sm"
                >
                  {skill}
                </span>
              ))}
              {topSkills.soft.map((skill) => (
                <span
                  key={skill}
                  className="text-sm bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all cursor-default font-light shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        <section>
          <div className="flex items-center gap-2 text-gray-700 text-xs uppercase tracking-widest mb-4 font-normal">
            <ShieldCheck size={13} />
            Verified Achievements
          </div>

          <div className="space-y-3">
            {timeline.slice(0, 12).map((achievement, idx) => (
              <div
                key={idx}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 transition-all group shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Award size={14} className="text-orange-500" />
                      </div>
                      <h3 className="text-base font-medium text-[#071A2F] group-hover:text-orange-600 transition-colors leading-snug">
                        {achievement.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-normal text-[#071A2F] font-light ml-11">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {achievement.level} • {achievement.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(achievement.eventDate).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                      {achievement.organizer && (
                        <span className="truncate max-w-[180px]">Organizer: {achievement.organizer}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-11 sm:ml-0 flex-shrink-0">
                    {achievement.verifications > 0 && (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-normal">
                        <CheckCircle size={11} />
                        {achievement.verifications}
                      </span>
                    )}
                    <a
                      href={achievement.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-normal bg-gray-50 text-orange-600 hover:text-orange-600 border border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-200 px-4 py-2 rounded-lg transition-all shadow-sm"
                    >
                      View
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {timeline.length > 10 && (
            <p className="text-center text-gray-800 text-normal font-medium mt-6">
              +{timeline.length - 10} more achievements
            </p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col items-center gap-3">

          <Link to="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>

          <p className="text-xs text-gray-900 font-light text-center">
            © 2026 AchievR. All rights reserved <br />
            Developed by Hack Titans (Shashank & Omkar)
          </p>

        </div>
      </footer>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-gray-200 border-t-orange-600 rounded-xl animate-spin mx-auto mb-6" />
        <p className="text-gray-800 font-medium text-sm">Loading portfolio...</p>
      </div>
    </div>
  );
}