import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { Plus, Share2, Loader } from "lucide-react";
import toast from "react-hot-toast";

import AchievementDashboard from "../components/Student/AchievementDashboard";
import PortfolioPreview from "../components/Student/PortfolioPreview";

export default function StudentDashboard({ user }) {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    certified: 0,
    pending: 0,
    rejected: 0,
    skillsCount: 0,
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

  /* ================= FETCH ================= */

  const fetchActivities = async () => {
    try {
      const response = await apiClient.get("/activities/my-activities", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = response.data.activities || [];
      setActivities(data);

      const certified = data.filter((a) => a.status === "certified").length;
      const pending = data.filter((a) => a.status === "pending").length;
      const rejected = data.filter((a) => a.status === "rejected").length;

      setStats({
        total: data.length,
        certified,
        pending,
        rejected,
        skillsCount: new Set(
          data.flatMap((a) => [
            ...(a.selectedTechnicalSkills || []),
            ...(a.selectedSoftSkills || []),
          ])
        ).size,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SHARE ================= */

  const handleSharePortfolio = async () => {
    setPreviewLoading(true);
    try {
      const response = await apiClient.get(`/recruiter/my-profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = response.data;

      const link = `${import.meta.env.VITE_FRONTEND_URL}/recruiter-view/${data?.student?.id}`;

      setPreviewData({
        ...data,
        shareableLink: link,
      });

      setPreviewOpen(true);
      toast.success("Portfolio preview loaded");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load preview");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleCopyLink = () => {
    const link =
      previewData?.shareableLink ||
      `${import.meta.env.VITE_FRONTEND_URL}/recruiter-view/${user?.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied");
  };

  const handleOpenInNewTab = () => {
    const link =
      previewData?.shareableLink ||
      `${import.meta.env.VITE_FRONTEND_URL}/recruiter-view/${user?.id}`;
    window.open(link, "_blank");
  };

  const handleShare = async () => {
    const link = `${import.meta.env.VITE_FRONTEND_URL}/recruiter-view/${user?.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.name}'s Portfolio`,
          text: `Check out ${user?.name}'s verified achievements`,
          url: link,
        });
        setPreviewOpen(false);
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleViewCertificateDetails = (certificate) => {
    setSelectedCertificate(certificate);
    setCertificateDetailsOpen(true);
  };

  /* ================= HELPERS ================= */

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const certificationRate =
    stats.total > 0
      ? Math.round((stats.certified / stats.total) * 100)
      : 0;

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

          {/* LEFT */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <p className="text-sm text-orange-600 font-medium">
              Hey {user?.name || "User"}
            </p>

            <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
              Your Achievement Dashboard
            </h1>

            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Track, verify and showcase your achievements in a professional way.
            </p>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

            <button
              onClick={handleSharePortfolio}
              disabled={previewLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-orange-300 bg-white text-sm text-orange-600 hover:bg-orange-50 transition disabled:opacity-50"
            >
              {previewLoading ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <Share2 size={14} />
              )}
              Share Portfolio
            </button>

            <button
              onClick={() => navigate("/submit")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-orange-600 text-white text-sm hover:bg-orange-700 transition"
            >
              <Plus size={14} />
              Add Achievement
            </button>
          </div>
        </div>

        {/* DASHBOARD */}
        <AchievementDashboard
          stats={stats}
          certificationRate={certificationRate}
          activities={activities}
          handleDownloadCertificate={() => {}}
          navigate={navigate}
        />
      </div>

      {/* PORTFOLIO MODAL */}
      <PortfolioPreview
        previewOpen={previewOpen}
        previewData={previewData}
        setPreviewOpen={setPreviewOpen}
        handleCopyLink={handleCopyLink}
        handleShare={handleShare}
        handleOpenInNewTab={handleOpenInNewTab}
        handleViewCertificateDetails={handleViewCertificateDetails}
        formatDate={formatDate}
      />
    </div>
  );
}