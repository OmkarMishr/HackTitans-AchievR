import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { CheckCircle, XCircle, Loader, Shield, Award, Calendar, User, Sparkles, ArrowLeft } from 'lucide-react';

export default function PublicVerify() {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await apiClient.get(`/verify/${hash}`);
        setVerificationData(response.data);
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationData({ verified: false, message: 'Error verifying certificate' });
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [hash]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <div className="p-6 bg-orange-50 rounded-full mb-6 w-fit mx-auto">
            <Loader className="w-16 h-16 text-orange-600 animate-spin" />
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-2">Verifying Certificate</h2>
          <p className="text-gray-600 font-light">Please wait while we validate authenticity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header with Logo */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-light text-gray-900">ACHIEVR</h1>
              <p className="text-xs text-gray-600 font-light">Certificate Verification</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 transition duration-300 font-medium text-sm rounded-lg"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Verification Status Card */}
        <div className={`bg-white border-4 rounded-2xl shadow-2xl overflow-hidden mb-8 transition duration-300 ${
          verificationData?.verified 
            ? 'border-green-500 hover:shadow-green-500/20' 
            : 'border-red-500 hover:shadow-red-500/20'
        }`}>
          {/* Status Header */}
          <div className={`p-8 text-center ${
            verificationData?.verified 
              ? 'bg-gradient-to-br from-green-50 to-white' 
              : 'bg-gradient-to-br from-red-50 to-white'
          }`}>
            <div className={`p-6 rounded-full w-fit mx-auto mb-4 ${
              verificationData?.verified ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {verificationData?.verified ? (
                <CheckCircle className="w-20 h-20 text-green-600" />
              ) : (
                <XCircle className="w-20 h-20 text-red-600" />
              )}
            </div>
            <h2 className={`text-4xl font-light mb-3 ${
              verificationData?.verified ? 'text-green-700' : 'text-red-700'
            }`}>
              {verificationData?.verified ? 'Certificate Verified' : 'Certificate Invalid'}
            </h2>
            <p className={`text-sm font-light ${
              verificationData?.verified ? 'text-green-600' : 'text-red-600'
            }`}>
              {verificationData?.message}
            </p>
          </div>

          {/* Certificate Details */}
          {verificationData?.certificate && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-orange-600" />
                <h3 className="text-2xl font-light text-gray-900">Certificate Details</h3>
              </div>

              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-orange-600" />
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Student Information</p>
                  </div>
                  <p className="text-2xl font-light text-gray-900">{verificationData.certificate.student}</p>
                </div>

                {/* Achievement Info */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-400 transition duration-300">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Achievement</p>
                  <p className="text-xl font-light text-gray-900 mb-4">{verificationData.certificate.activity}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Level</p>
                      <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                        {verificationData.certificate.level}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Issued Date</p>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="font-light">
                          {new Date(verificationData.certificate.issuedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                {verificationData.certificate.skills && (
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-400 transition duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-5 h-5 text-orange-600" />
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Skills Demonstrated</p>
                    </div>
                    
                    <div className="space-y-4">
                      {verificationData.certificate.skills.technical?.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium mb-2 uppercase tracking-wider">Technical Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {verificationData.certificate.skills.technical.map(skill => (
                              <span 
                                key={skill} 
                                className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {verificationData.certificate.skills.soft?.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium mb-2 uppercase tracking-wider">Soft Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {verificationData.certificate.skills.soft.map(skill => (
                              <span 
                                key={skill} 
                                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium"
                              >
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
          )}
        </div>

        {/* Security Info */}
        <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Blockchain Verification</p>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                This certificate is secured with blockchain technology and cryptographic hashing. 
                Each certificate has a unique verification code that ensures authenticity and prevents tampering.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-600 font-light">
            Powered by <span className="font-medium text-orange-600">AchievR</span> - Cryptographic Verification Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}
