import { Download, Folder, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AchievementDashboard({
  stats,
  certificationRate,
  activities,
  handleDownloadCertificate,
}) {

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

  return (
    <div className="space-y-8">

      {/* KPI CARDS  */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

        <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm opacity-80">Total Activities</p>
          <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
        </div>

        <div className="bg-emerald-600 text-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm opacity-80">Certified</p>
          <p className="mt-2 text-2xl font-semibold">{stats.certified}</p>
        </div>

        <div className="bg-amber-500 text-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm opacity-80">Under Review</p>
          <p className="mt-2 text-2xl font-semibold">{stats.pending}</p>
        </div>

        <div className="bg-rose-500 text-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm opacity-80">Rejected</p>
          <p className="mt-2 text-2xl font-semibold">{stats.rejected}</p>
        </div>

        <div className="bg-indigo-600 text-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm opacity-80">Success Rate</p>
          <p className="mt-2 text-2xl font-semibold">{certificationRate}%</p>
        </div>

      </div>

      {/*TABLE */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Folder size={18} className="text-gray-600" />
            <h2 className="text-lg font-medium text-gray-900">
              Your Activities
            </h2>
          </div>

          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
            {activities.length} records
          </span>
        </div>

        {/*Desktop Tabl */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-left font-medium">Category</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Skills</th>
                <th className="px-6 py-3 text-left font-medium">Certificate</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {activities.map((activity) => {

                let statusStyle =
                  "bg-rose-50 text-rose-700 border border-rose-100";

                if (activity.status === "certified") {
                  statusStyle =
                    "bg-emerald-50 text-emerald-700 border border-emerald-100";
                } else if (activity.status === "pending") {
                  statusStyle =
                    "bg-amber-50 text-amber-700 border border-amber-100";
                }

                return (
                  <tr
                    key={activity._id}
                    className="hover:bg-gray-50 hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)] transition"
                  >
                    {/* Title */}
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {activity.title}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        {activity.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(activity.eventDate)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}
                      >
                        {activity.status === "certified" && (
                          <CheckCircle size={13} />
                        )}
                        {activity.status === "pending" && (
                          <Clock size={13} />
                        )}
                        {activity.status === "rejected" && (
                          <XCircle size={13} />
                        )}
                        {activity.status}
                      </span>
                    </td>

                    {/* Skills */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {activity.selectedTechnicalSkills
                          ?.slice(0, 2)
                          .map((skill, i) => (
                            <span
                              key={`${skill}-${i}`}
                              className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    </td>

                    {/* Certificate */}
                    <td className="px-6 py-4">
                      {activity.status === "certified" &&
                        activity.certificateId ? (
                        <button
                          onClick={() =>
                            handleDownloadCertificate(activity.certificateId)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
                                     bg-orange-600 text-white text-xs font-medium
                                     hover:bg-orange-700 transition shadow-sm hover:shadow"
                        >
                          <Download size={14} />
                          Download
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Not available
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

        {/* Mobile Cards*/}
        <div className="md:hidden divide-y divide-gray-100">
          {activities.map((activity) => {

            let statusStyle =
              "bg-rose-50 text-rose-700 border border-rose-100";

            if (activity.status === "certified") {
              statusStyle =
                "bg-emerald-50 text-emerald-700 border border-emerald-100";
            } else if (activity.status === "pending") {
              statusStyle =
                "bg-amber-50 text-amber-700 border border-amber-100";
            }

            return (
              <div
                key={activity._id}
                className="p-5 space-y-3 hover:bg-gray-50 transition"
              >
                <p className="font-semibold text-gray-900">
                  {activity.title}
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-gray-100">
                    {activity.category}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${statusStyle}`}
                  >
                    {activity.status === "certified" && (
                      <CheckCircle size={12} />
                    )}
                    {activity.status === "pending" && (
                      <Clock size={12} />
                    )}
                    {activity.status === "rejected" && (
                      <XCircle size={12} />
                    )}
                    {activity.status}
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  {formatDate(activity.eventDate)}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {activity.selectedTechnicalSkills
                    ?.slice(0, 3)
                    .map((skill, i) => (
                      <span
                        key={`${skill}-${i}`}
                        className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                </div>

                {activity.status === "certified" &&
                  activity.certificateId ? (
                  <button
                    onClick={() =>
                      handleDownloadCertificate(activity.certificateId)
                    }
                    className="w-full mt-2 py-2 rounded-md bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
                  >
                    Download Certificate
                  </button>
                ) : (
                  <p className="text-xs text-gray-400">
                    Certificate not available
                  </p>
                )}
              </div>
            );
          })}

          {activities.length === 0 && (
            <div className="p-12 text-center text-gray-500 text-sm">
              No activities yet. Start by adding your first achievement.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}