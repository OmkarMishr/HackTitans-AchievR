import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { Plus, ExternalLink, Loader } from "lucide-react";
import toast from "react-hot-toast";

import AchievementDashboard from "../components/Student/AchievementDashboard";
import Footer from "../components/Footer";

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

  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

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

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const response = await apiClient.get(
        `/certificates/download/${certificateId}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download certificate");
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 sm:mb-10">

          <div>
            <p className="text-sm text-orange-600 font-medium mb-1">
              Hey {user?.name || "User"}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-gray-900 tracking-tight leading-tight">
              Your Achievement Dashboard
            </h1>
            <p className="mt-2 text-gray-600 font-light">
              Track, verify and showcase your achievements in a professional way.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap items-center gap-3">

            {/* View Portfolio — opens recruiter page in new tab */}
            <button
              onClick={() => window.open(`/portfolio/${user?.id}`, '_blank')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 hover:shadow-sm transition"
            >
              <ExternalLink size={15} />
              View Portfolio
            </button>

            <button
              onClick={() => navigate("/submit")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 text-white text-sm hover:bg-orange-700 shadow-sm hover:shadow-md transition"
            >
              <Plus size={15} />
              Add Activity
            </button>

          </div>
        </div>

        <AchievementDashboard
          stats={stats}
          certificationRate={certificationRate}
          activities={activities}
          handleDownloadCertificate={handleDownloadCertificate}
          navigate={navigate}
        />
      </div>

      <Footer />
    </div>
  );
}
