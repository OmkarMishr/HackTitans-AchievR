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
    (previewData.skills?.technical?.length || 0) +
    (previewData.skills?.soft?.length || 0) +
    (previewData.skills?.tools?.length || 0);

  const certifiedActivities = previewData.activities || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4">
      <div className="flex w-full max-w-5xl max-h-[92vh] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white px-5 sm:px-6 py-4 sm:py-5">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Portfolio preview
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
              A verified summary of this student&apos;s work and skills.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPreviewOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 sm:py-8 space-y-10 sm:space-y-12">
          {/* Profile */}
          <section className="rounded-xl border border-gray-100 bg-gray-50 px-5 sm:px-6 py-5 sm:py-6">
            <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {previewData.student?.name}
                </h3>

                <div className="mt-3 space-y-1 text-xs sm:text-sm text-gray-600">
                  {previewData.student?.rollNumber && (
                    <p>
                      <span className="font-medium text-gray-800">ID:</span>{" "}
                      {previewData.student.rollNumber}
                    </p>
                  )}
                  {previewData.student?.department && (
                    <p>
                      <span className="font-medium text-gray-800">
                        Department:
                      </span>{" "}
                      {previewData.student.department}
                    </p>
                  )}
                  {previewData.student?.email && (
                    <p className="break-all">
                      <span className="font-medium text-gray-800">Email:</span>{" "}
                      {previewData.student.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-1 justify-start sm:justify-end gap-8 sm:gap-10">
                <Stat
                  label="Verified certificates"
                  value={previewData.totalCertifiedActivities || 0}
                />
                <Stat label="Skills recorded" value={totalSkills} />
              </div>
            </div>
          </section>

          {/* Skills */}
          {totalSkills > 0 && (
            <section>
              <h4 className="mb-4 sm:mb-5 text-base sm:text-lg font-semibold text-gray-900">
                Skill overview
              </h4>

              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
                {[
                  ["Technical", previewData.skills.technical],
                  ["Soft skills", previewData.skills.soft],
                  ["Tools & tech", previewData.skills.tools],
                ].map(([title, list]) => {
                  const skills = list || [];
                  if (!skills.length) return null;

                  return (
                    <div
                      key={title}
                      className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm"
                    >
                      <p className="mb-3 text-xs sm:text-sm font-medium text-gray-800">
                        {title}
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {skills.map((item, index) => (
                          <span
                            key={`${item}-${index}`}
                            className="rounded-full bg-gray-100 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-gray-800"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Certified achievements */}
          {certifiedActivities.length > 0 && (
            <section>
              <h4 className="mb-4 sm:mb-5 text-base sm:text-lg font-semibold text-gray-900">
                Issued certificates
              </h4>

              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
                {certifiedActivities.map((activity) => (
                  <button
                    key={activity._id}
                    type="button"
                    onClick={() => handleViewCertificateDetails(activity)}
                    className="flex flex-col rounded-xl border border-gray-100 bg-white p-4 sm:p-5 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm sm:text-base font-semibold text-gray-900">
                          {activity.title}
                        </p>
                        <p className="mt-1 text-xs sm:text-sm text-gray-500">
                          {activity.category} • {activity.achievementLevel}
                        </p>
                      </div>
                      <CheckCircle
                        size={18}
                        className="mt-0.5 flex-shrink-0 text-emerald-500"
                      />
                    </div>

                    <p className="mt-3 text-[11px] sm:text-xs text-gray-500">
                      Issued on{" "}
                      {formatDate(
                        activity.issuedAt ||
                          activity.certifiedAt ||
                          activity.eventDate ||
                          activity.createdAt
                      )}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Share section */}
          <section className="rounded-xl border border-gray-100 bg-gray-50 px-5 sm:px-6 py-5 sm:py-6">
            <p className="mb-2 text-sm font-medium text-gray-900">
              Share with recruiters
            </p>
            <p className="mb-3 text-[11px] sm:text-xs text-gray-500">
              Send this link in applications, emails, or LinkedIn messages. It
              opens a read‑only, verified version of this portfolio.
            </p>

            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
              <p className="flex-1 truncate text-xs sm:text-sm text-gray-600">
                {previewData.shareableLink}
              </p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 transition"
              >
                <Copy size={16} className="text-gray-700" />
              </button>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col gap-2.5 sm:flex-row border-t bg-white px-4 sm:px-5 py-3 sm:py-4">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
          >
            Share portfolio
          </button>

          <button
            type="button"
            onClick={handleOpenInNewTab}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition"
          >
            <ExternalLink size={16} />
            View full portfolio
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-[11px] uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}