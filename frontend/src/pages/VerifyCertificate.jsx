import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ShieldCheck, CheckCircle, XCircle, Calendar, Award, Copy, User
} from 'lucide-react';
import achievrLogo from '../assets/achievr-logo.png';

const BACKEND_URL = 'http://localhost:5000';

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (certificateId) verifyCertificate(certificateId);
  }, [certificateId]);

  const verifyCertificate = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/certificates/verify/${id}`);
      const backendData = await response.json();
      setVerification({ status: backendData.status, data: backendData });
    } catch {
      setVerification({ status: 'error', message: 'Service unavailable' });
    } finally {
      setLoading(false);
    }
  };

  const copyCertificateId = () => {
    navigator.clipboard.writeText(certificateId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) return <LoadingState certId={certificateId} />;

  const isValid = verification?.status === 'valid' && verification?.data;
  const data = verification?.data || {};

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/">
            <img src={achievrLogo} alt="AchievR" className="h-8 w-auto" />
          </a>
          <button
            onClick={copyCertificateId}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-normal rounded-lg transition-all"
          >
            <Copy size={14} />
            {copied ? 'Copied!' : 'Copy ID'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-6">

        {/* Status Banner */}
        <div className={`rounded-2xl border p-8 flex flex-col lg:flex-row lg:items-center gap-6 shadow-sm ${
          isValid
            ? 'bg-green-50 border-green-200'
            : 'bg-white border-gray-200'
        }`}>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border ${
            isValid
              ? 'bg-green-100 border-green-200'
              : 'bg-gray-100 border-gray-200'
          }`}>
            {isValid
              ? <CheckCircle className="w-7 h-7 text-green-600" />
              : <XCircle className="w-7 h-7 text-gray-400" />
            }
          </div>

          <div className="flex-1">
            <h1 className={`text-2xl font-semibold ${isValid ? 'text-green-800' : 'text-gray-900'}`}>
              {isValid ? 'Certificate Verified' : verification?.status === 'not_found' ? 'Certificate Not Found' : 'Invalid Certificate'}
            </h1>
            <p className="text-gray-500 font-light mt-1 text-sm">
              {verification?.message || 'Certificate authenticity checked against AchievR registry.'}
            </p>
          </div>

          {/* Certificate ID pill */}
          <div className="font-mono text-xs bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-gray-500 tracking-wider whitespace-nowrap shadow-sm">
            {certificateId}
          </div>
        </div>

        {/* Certificate Details */}
        {isValid && data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Student Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest mb-5 font-normal">
                <User size={13} />
                Student
              </div>
              <p className="text-gray-900 text-xl font-medium mb-3">{data.student}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-mono bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full">
                  {data.rollNo}
                </span>
                <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded-full capitalize">
                  {data.department}
                </span>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest mb-5 font-normal">
                <Award size={13} />
                Achievement
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-xs mb-1.5">Title</p>
                  <p className="text-gray-900 font-medium text-lg leading-snug">{data.achievement}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1.5">Level</p>
                  <span className="inline-flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg font-normal">
                    <Award size={13} />
                    {data.level}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1.5">Organizer</p>
                  <p className="text-gray-700 font-light">{data.organizer}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1.5">Event Date</p>
                  <div className="flex items-center gap-2 text-gray-700 font-light">
                    <Calendar size={13} className="text-gray-400" />
                    {new Date(data.eventDate).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <span className="text-xs uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-full font-normal">
                  {data.category} Achievement
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Error / Not found state
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-7 h-7 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              {verification?.status === 'not_found' ? 'No Record Found' : 'Verification Failed'}
            </h2>
            <p className="text-gray-500 font-light max-w-md mx-auto leading-relaxed text-sm">
              {verification?.message || 'This certificate could not be verified. It may be invalid or expired.'}
            </p>
          </div>
        )}

        {/* Footer row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-gray-400 text-sm font-light">
            Verified by AchievR's secure certificate registry
          </p>
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 px-6 py-2.5 rounded-lg transition-all shadow-sm"
          >
            Back to AchievR
          </a>
        </div>
      </main>
    </div>
  );
}

function LoadingState({ certId }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-gray-200 border-t-orange-500 rounded-xl animate-spin mx-auto mb-6" />
        <h2 className="text-lg font-medium text-gray-900 mb-2">Verifying Certificate</h2>
        <p className="text-gray-400 font-light text-sm mb-6">Checking with AchievR registry...</p>
        <div className="font-mono text-xs bg-white border border-gray-200 text-gray-500 px-5 py-3 rounded-lg inline-block shadow-sm tracking-wider">
          {certId}
        </div>
      </div>
    </div>
  );
}