import { useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";
import { TrendingUp, Award, Clock, XCircle, Layers } from "lucide-react";

// ── Brand colours (mirrors Achievr's orange accent) ──────────────────────────
const C = {
  certified : "#16a34a",   // green-600
  pending   : "#ea580c",   // orange-600  (brand accent)
  rejected  : "#dc2626",   // red-600
  total     : "#0ea5e9",   // sky-500
  skills    : "#8b5cf6",   // violet-500
};

// ── Recharts shared tooltip ───────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3.5 py-2.5 shadow-lg text-xs font-medium">
      {label && <p className="text-gray-500 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? p.fill ?? "#111" }}>
          {p.name}: <span className="text-gray-800">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ── 1. Donut — status breakdown ───────────────────────────────────────────────
function StatusDonut({ stats }) {
  const data = [
    { name: "Certified",    value: stats.certified, fill: C.certified },
    { name: "Under Review", value: stats.pending,   fill: C.pending   },
    { name: "Rejected",     value: stats.rejected,  fill: C.rejected  },
  ].filter((d) => d.value > 0);

  const isEmpty = data.length === 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
      <p className="text-sm font-semibold text-gray-800">Status Breakdown</p>
      <p className="text-xs text-gray-400 mb-1">
        Proportional view of {stats.total} activit{stats.total === 1 ? "y" : "ies"}
      </p>

      {isEmpty ? (
        <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-300">
          <Award size={32} strokeWidth={1.5} />
          <p className="text-xs">No activities yet</p>
        </div>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="78%"
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                strokeWidth={0}
              >
                {data.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: "11px", paddingTop: "4px" }}
                formatter={(v) => <span className="text-gray-600">{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {!isEmpty && (
        <div className="flex gap-3 mt-1 flex-wrap">
          {data.map((d) => (
            <span
              key={d.name}
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: d.fill + "18", color: d.fill }}
            >
              {d.name} · {d.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 2. Bar — status counts ────────────────────────────────────────────────────
function StatusBar({ stats }) {
  const data = [
    { name: "Certified",    value: stats.certified, fill: C.certified },
    { name: "Under Review", value: stats.pending,   fill: C.pending   },
    { name: "Rejected",     value: stats.rejected,  fill: C.rejected  },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
      <p className="text-sm font-semibold text-gray-800">Status Distribution</p>
      <p className="text-xs text-gray-400 mb-1">Count per submission status</p>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barCategoryGap="40%"
            margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={800}>
              {data.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── 3. Success rate — animated progress ──────────────────────────────────────
function SuccessGauge({ certificationRate, stats }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <p className="text-sm font-semibold text-gray-800">Success Rate</p>
      <p className="text-xs text-gray-400">Certified ÷ total submitted</p>

      <div className="flex items-end gap-1 mt-1">
        <span className="text-5xl font-bold text-gray-900 tabular-nums leading-none">
          {certificationRate}
        </span>
        <span className="text-2xl font-semibold text-gray-400 pb-1">%</span>
      </div>

      <div className="space-y-2 mt-1">
        <div className="flex h-3 rounded-full overflow-hidden bg-gray-100 gap-px">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${certificationRate}%`,
              background: `linear-gradient(90deg, ${C.certified}, #4ade80)`,
              minWidth: certificationRate > 0 ? "6px" : "0",
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{stats.certified} certified</span>
          <span>{stats.total} total</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
        {[
          { label: "Certified", val: stats.certified, color: C.certified },
          { label: "Under Review", val: stats.pending, color: C.pending },
          { label: "Rejected", val: stats.rejected, color: C.rejected },
          { label: "Skills", val: stats.skillsCount, color: C.skills },
        ].map(({ label, val, color }) => (
          <div
            key={label}
            className="rounded-xl px-3 py-2"
            style={{ background: color + "12" }}
          >
            <p className="text-lg font-bold tabular-nums" style={{ color }}>{val}</p>
            <p className="text-xs" style={{ color: color + "cc" }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 4. Horizontal bar — top skills histogram ─────────────────────────────────
function SkillsHistogram({ activities }) {
  const data = useMemo(() => {
    const freq = {};
    activities.forEach((a) => {
      [
        ...(a.selectedTechnicalSkills || []),
        ...(a.selectedSoftSkills || []),
      ].forEach((s) => { freq[s] = (freq[s] || 0) + 1; });
    });
    return Object.entries(freq)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [activities]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
      <p className="text-sm font-semibold text-gray-800">Top Skills</p>
      <p className="text-xs text-gray-400 mb-1">Most-used across all activities</p>
      <div className="h-52">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <Layers size={32} strokeWidth={1.5} />
            <p className="text-xs">No skills logged yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={88}
                tick={{ fontSize: 10, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f9fafb" }} />
              <Bar
                dataKey="count"
                name="Activities"
                fill={C.pending}
                radius={[0, 6, 6, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ── 5. Timeline — activities over time (monthly) ──────────────────────────────
function ActivityTimeline({ activities }) {
  const data = useMemo(() => {
    const map = {};
    activities.forEach((a) => {
      const raw = a.createdAt || a.submittedAt || a.date;
      if (!raw) return;
      const d = new Date(raw);
      if (isNaN(d)) return;
      const key = d.toLocaleDateString("en-US", { year: "2-digit", month: "short" });
      if (!map[key]) map[key] = { month: key, total: 0, certified: 0 };
      map[key].total++;
      if (a.status === "certified") map[key].certified++;
    });
    return Object.values(map).slice(-8);
  }, [activities]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 col-span-full sm:col-span-2">
      <p className="text-sm font-semibold text-gray-800">Activity Timeline</p>
      <p className="text-xs text-gray-400 mb-1">Monthly submissions & certifications</p>
      <div className="h-52">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <TrendingUp size={32} strokeWidth={1.5} />
            <p className="text-xs">Not enough data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 12, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: "11px" }}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Submitted"
                stroke={C.pending}
                strokeWidth={2}
                dot={{ r: 3, fill: C.pending, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                animationDuration={800}
              />
              <Line
                type="monotone"
                dataKey="certified"
                name="Certified"
                stroke={C.certified}
                strokeWidth={2}
                dot={{ r: 3, fill: C.certified, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ActivityStats({ stats, certificationRate, activities }) {
  return (
    <section className="mt-2 mb-8">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={16} className="text-orange-500" />
        <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
          Activity Analytics
        </h2>
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-8">
        <StatusDonut stats={stats} />
        <StatusBar stats={stats} />
        <SuccessGauge certificationRate={certificationRate} stats={stats} />
        <SkillsHistogram activities={activities} />
        <ActivityTimeline activities={activities} />
      </div>
    </section>
  );
}