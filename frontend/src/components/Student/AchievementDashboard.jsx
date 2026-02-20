export default function AchievementDashboard({
  stats,
  certificationRate,
  activities,
  handleDownloadCertificate,
}) {
  const cards = [
    { label: "Total Activities", value: stats.total, color: "bg-slate-900" },
    { label: "Certified", value: stats.certified, color: "bg-emerald-600" },
    { label: "Under Review", value: stats.pending, color: "bg-amber-500" },
    { label: "Rejected", value: stats.rejected, color: "bg-rose-500" },
    { label: "Success Rate", value: `${certificationRate}%`, color: "bg-indigo-600" },
  ];

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
    <div className="space-y-6 sm:space-y-8">

      {/*  KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.color} text-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition`}
          >
            <p className="text-xs sm:text-sm opacity-80">{card.label}</p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* ACTIVITIES */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-6 py-4 border-b bg-slate-50">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">
            Your Activities
          </h2>
          <span className="text-xs sm:text-sm text-slate-500">
            {activities.length} total
          </span>
        </div>

        {/*  DESKTOP TABLE*/}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Skills</th>
                <th className="px-6 py-3 text-left">Certificate</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {activities.map((activity) => {
                const statusStyle =
                  activity.status === "certified"
                    ? "bg-emerald-50 text-emerald-700"
                    : activity.status === "pending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-rose-50 text-rose-700";

                return (
                  <tr key={activity._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {activity.title}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                        {activity.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(activity.eventDate)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}
                      >
                        {activity.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {activity.selectedTechnicalSkills
                          ?.slice(0, 2)
                          .map((skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {activity.status === "certified" &&
                        activity.certificateId ? (
                        <button
                          onClick={() =>
                            handleDownloadCertificate(activity.certificateId)
                          }
                          className="px-3 py-1.5 rounded-md bg-orange-600 text-white text-xs hover:bg-orange-700 transition"
                        >
                          Download
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">
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

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y">
          {activities.map((activity) => {
            const statusStyle =
              activity.status === "certified"
                ? "bg-emerald-50 text-emerald-700"
                : activity.status === "pending"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-rose-50 text-rose-700";

            return (
              <div key={activity._id} className="p-4 space-y-2">
                <p className="font-semibold text-slate-800">
                  {activity.title}
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-slate-100">
                    {activity.category}
                  </span>

                  <span
                    className={`px-2 py-1 rounded ${statusStyle}`}
                  >
                    {activity.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  {formatDate(activity.eventDate)}
                </p>

                <div className="flex flex-wrap gap-2">
                  {activity.selectedTechnicalSkills
                    ?.slice(0, 3)
                    .map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs"
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
                    className="mt-2 w-full py-2 rounded-md bg-orange-600 text-white text-xs hover:bg-orange-700 transition"
                  >
                    Download Certificate
                  </button>
                ) : (
                  <p className="text-xs text-slate-400">No certificate</p>
                )}
              </div>
            );
          })}

          {activities.length === 0 && (
            <div className="p-10 text-center text-slate-500 text-sm">
              No activities yet. Start by adding your first achievement.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}