// src/pages/VerifyCertificate.jsx
import { useState } from 'react';
import { CheckCircle, AlertCircle, Loader, Copy } from 'lucide-react';
import apiClient from '../api/apiClient';
export default function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState('');
  const [verified, setVerified] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setVerified(null);
      setCertificateData(null);

      console.log('Verifying certificate:', certificateId);

      // CORRECT BACKEND URL
      const response = await apiClient.get(`/certificates/verify/${certificateId}`);

      console.log('Response:', response.data);

      if (response.data.verified) {
        setVerified(true);
        setCertificateData(response.data.data);
      } else {
        setVerified(false);
        setError(response.data.message || 'Certificate verification failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setVerified(false);
      
      // Better error handling
      if (err.response?.status === 404) {
        setError('Certificate not found');
      } else if (err.response?.status === 403) {
        setError('Certificate is invalid or revoked');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to verify certificate');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-gray-900 mb-4">
            🔐 Verify Certificate
          </h1>
          <p className="text-gray-600 font-light text-lg">
            Enter your certificate ID to verify its authenticity
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleVerify} className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 mb-8">
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="Enter Certificate ID (e.g., CERT_690940b1_1762220699731)"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 font-light"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 transition font-medium flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8 flex gap-4 items-start animate-in">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-red-700 font-medium">Verification Failed</p>
              <p className="text-red-600 font-light mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Success - Certificate Data */}
        {verified && certificateData && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 space-y-6 animate-in">
            {/* Success Header */}
            <div className="flex items-center gap-3 pb-6 border-b-2 border-green-200">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-light text-green-900">
                Certificate Verified & Valid
              </h2>
            </div>

            {/* Certificate Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Name */}
              <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                  👤 Student Name
                </p>
                <p className="text-lg text-gray-900 font-light mt-2">
                  {certificateData.studentName || 'N/A'}
                </p>
              </div>

              {/* Email */}
              <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                  Email
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg text-gray-900 font-light break-all">
                    {certificateData.studentEmail || 'N/A'}
                  </p>
                  <button
                    onClick={() => copyToClipboard(certificateData.studentEmail)}
                    className="ml-2 p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Roll Number */}
              <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                  🎓 Roll Number
                </p>
                <p className="text-lg text-gray-900 font-light mt-2">
                  {certificateData.studentRollNumber || 'N/A'}
                </p>
              </div>

              {/* Achievement */}
              <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                  Achievement
                </p>
                <p className="text-lg text-gray-900 font-light mt-2">
                  {certificateData.achievement || 'N/A'}
                </p>
              </div>

              {/* Category */}
              <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                  Category
                </p>
                <p className="text-lg text-gray-900 font-light mt-2">
                  {certificateData.achievementCategory || 'N/A'}
                </p>
              </div>

              {/* Level */}
              <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                  Level
                </p>
                <p className="text-lg font-light mt-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                    {certificateData.achievementLevel || 'N/A'}
                  </span>
                </p>
              </div>

              {/* Issued Date */}
              <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                  Issued Date
                </p>
                <p className="text-lg text-gray-900 font-light mt-2">
                  {certificateData.issuedDate
                    ? new Date(certificateData.issuedDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>

              {/* Expires Date */}
              <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                  Expires Date
                </p>
                <p className="text-lg text-gray-900 font-light mt-2">
                  {certificateData.expiresDate
                    ? new Date(certificateData.expiresDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>

              {/* Status */}
              <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                  Status
                </p>
                <p className="text-lg font-light mt-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    {certificateData.status
                      ? certificateData.status.toUpperCase()
                      : 'N/A'}
                  </span>
                </p>
              </div>

              {/* Verification Count */}
              <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                  Verification Count
                </p>
                <p className="text-lg text-gray-900 font-light mt-2">
                  {certificateData.verificationCount || 0} times verified
                </p>
              </div>
            </div>

            {/* Organizing Body */}
            {certificateData.organizingBody && (
              <div className="bg-white rounded-lg p-6 border border-green-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-2">
                  Organizing Body
                </p>
                <p className="text-lg text-gray-900 font-light">
                  {certificateData.organizingBody}
                </p>
              </div>
            )}

            {/* Issued By */}
            <div className="bg-white rounded-lg p-6 border border-green-200 hover:shadow-lg transition">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-2">
                Issued By
              </p>
              <p className="text-lg text-gray-900 font-light">
                {certificateData.issuedBy || 'N/A'}
              </p>
            </div>

            {/* Success Message */}
            <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 text-center">
              <p className="text-green-800 font-light">
                This certificate has been verified and is authentic!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}