import { X, Copy, CheckCircle, ExternalLink } from "lucide-react";

export default function PortfolioPreview({
  previewOpen,
  previewData,
  setPreviewOpen,
  handleCopyLink,
  handleShare,
  handleOpenInNewTab,
  handleViewCertificateDetails,
  formatDate,
}) {
  if (!previewOpen || !previewData) return null;

  const totalSkills =
    previewData.skills.technical.length +
    previewData.skills.soft.length +
    previewData.skills.tools.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Portfolio Preview
            </h2>
            <p className="text-sm text-gray-500">
              A verified snapshot of achievements & skills
            </p>
          </div>

          <button onClick={() => setPreviewOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition" >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-8 space-y-12">

          {/* Profile */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">

              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {previewData.student.name}
                </h3>

                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>🎓 {previewData.student.rollNumber}</p>
                  <p>💻 {previewData.student.department}</p>
                  <p className="break-all">✉️ {previewData.student.email}</p>
                </div>
              </div>

              <div className="flex gap-10">
                <Stat label="Verified Achievements" value={previewData.totalCertifiedActivities} />
                <Stat label="Total Skills" value={totalSkills} />
              </div>
            </div>
          </div>

          {/* Skills */}
          {totalSkills > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">
                Skills & Capabilities
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  ["Technical Skills", previewData.skills.technical],
                  ["Soft Skills", previewData.skills.soft],
                  ["Tools & Tech", previewData.skills.tools],
                ].map(([title, list]) =>
                  list.length > 0 && (
                    <div
                      key={title}
                      className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm"
                    >
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        {title}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {list.map((item, index) => (
                          <span
                            key={`${item}-${index}`}
                            className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Certificates */}
          {previewData.activities.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">
                Certified Achievements
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {previewData.activities.map((activity) => (
                  <div
                    key={activity._id}
                    onClick={() => handleViewCertificateDetails(activity)}
                    className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md hover:border-orange-300 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-base font-semibold text-gray-900">
                          {activity.title}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {activity.category} • {activity.achievementLevel}
                        </p>
                      </div>

                      <CheckCircle size={18} className="text-emerald-500" />
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                      Issued on{" "}
                      {formatDate(
                        activity.issuedAt ||
                        activity.certifiedAt ||
                        activity.eventDate ||
                        activity.createdAt
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <p className="text-sm font-medium text-gray-900 mb-3">
              Share this portfolio
            </p>

            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-600 truncate flex-1">
                {previewData.shareableLink}
              </p>

              <button
                onClick={handleCopyLink}
                className="p-1 rounded hover:bg-gray-100 transition"
              >
                <Copy size={16} className="text-orange-600" />
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t bg-white p-4 flex flex-col sm:flex-row gap-3">


          <button
            onClick={handleShare}
            className=" flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition"
          >
            Share Portfolio
          </button>

          <button
            onClick={handleOpenInNewTab}
            className="flex-1 bg-orange-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-orange-700 transition flex items-center justify-center gap-2"
          >
            <ExternalLink size={16} />
            View Full Portfolio
          </button>

        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-xs uppercase text-gray-400 tracking-wide">{label}</p>
      <p className="text-3xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}