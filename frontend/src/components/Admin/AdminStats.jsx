
import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  GraduationCap,
  Briefcase,
  FileText,
  Award,
  Clock3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Layers3,
} from "lucide-react";

const COLORS = {
  students: "#2563eb",
  staff: "#7c3aed",
  admins: "#0f766e",
  activities: "#ea580c",
  certified: "#16a34a",
  pending: "#f59e0b",
  rejected: "#dc2626",
  certificates: "#0891b2",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2">
      {label && <p className="text-xs text-gray-500 mb-1">{label}</p>}
      {payload.map((item, idx) => (
        <p
          key={idx}
          className="text-sm font-medium"
          style={{ color: item.color || item.fill }}
        >
          {item.name}: <span className="text-gray-900">{item.value}</span>
        </p>
      ))}
    </div>
  );
};


function UsersPieChart({ stats }) {
  const data = [
    { name: "Students", value: stats?.students || 0, fill: COLORS.students },
    { name: "Staff", value: stats?.staff || 0, fill: COLORS.staff },
    { name: "Admins", value: stats?.admins || 0, fill: COLORS.admins },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <p className="text-sm font-semibold text-gray-800 mb-1">User Distribution</p>
      <p className="text-xs text-gray-400 mb-4">Students, staff, and admins</p>

      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-300">
          <div className="text-center">
            <Users size={34} className="mx-auto mb-2" />
            <p className="text-xs">No user data available</p>
          </div>
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function ActivityStatusBar({ stats }) {
  const data = [
    { name: "Certified", value: stats?.certified || 0, fill: COLORS.certified },
    { name: "Pending", value: stats?.pending || 0, fill: COLORS.pending },
    { name: "Rejected", value: stats?.rejected || 0, fill: COLORS.rejected },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <p className="text-sm font-semibold text-gray-800 mb-1">Activity Status</p>
      <p className="text-xs text-gray-400 mb-4">Review outcome distribution</p>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SummaryProgress({ stats }) {
  const totalActivities = stats?.activities || 0;
  const certified = stats?.certified || 0;
  const pending = stats?.pending || 0;
  const rejected = stats?.rejected || 0;

  const successRate =
    totalActivities > 0 ? Math.round((certified / totalActivities) * 100) : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <p className="text-sm font-semibold text-gray-800 mb-1">Approval Rate</p>
      <p className="text-xs text-gray-400 mb-4">Certified out of all activities</p>

      <div className="flex items-end gap-1 mb-4">
        <span className="text-5xl font-bold text-gray-900 tabular-nums">{successRate}</span>
        <span className="text-2xl text-gray-400 font-semibold mb-1">%</span>
      </div>

      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${successRate}%`,
            background: "linear-gradient(90deg, #16a34a, #4ade80)",
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400 mb-4">
        <span>{certified} certified</span>
        <span>{totalActivities} total</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Pending", value: pending, color: COLORS.pending },
          { label: "Rejected", value: rejected, color: COLORS.rejected },
          { label: "Certificates", value: stats?.certificates || 0, color: COLORS.certificates },
          { label: "Users", value: stats?.users || 0, color: COLORS.students },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: `${item.color}12` }}
          >
            <p className="text-lg font-bold tabular-nums" style={{ color: item.color }}>
              {item.value}
            </p>
            <p className="text-xs" style={{ color: item.color }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityTrend({ monthlyData = [] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 col-span-full xl:col-span-2">
      <p className="text-sm font-semibold text-gray-800 mb-1">Monthly Trend</p>
      <p className="text-xs text-gray-400 mb-4">Activities and certificates over time</p>

      {monthlyData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-300">
          <div className="text-center">
            <TrendingUp size={34} className="mx-auto mb-2" />
            <p className="text-xs">No monthly trend data</p>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="activities"
                stroke={COLORS.activities}
                strokeWidth={3}
                name="Activities"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="certificates"
                stroke={COLORS.certificates}
                strokeWidth={3}
                name="Certificates"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function TopDepartmentsChart({ departmentData = [] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <p className="text-sm font-semibold text-gray-800 mb-1">Top Categories</p>
      <p className="text-xs text-gray-400 mb-4">Most active groups or departments</p>

      {departmentData.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-300">
          <div className="text-center">
            <Layers3 size={34} className="mx-auto mb-2" />
            <p className="text-xs">No category data available</p>
          </div>
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentData}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill={COLORS.activities} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default function AdminStats({
  stats = {},
  monthlyData = [],
  departmentData = [],
}) {
  const mergedStats = useMemo(
    () => ({
      users: stats.users || 0,
      students: stats.students || 0,
      staff: stats.staff || 0,
      admins: stats.admins || 0,
      activities: stats.activities || 0,
      certificates: stats.certificates || 0,
      certified: stats.certified || 0,
      pending: stats.pending || 0,
      rejected: stats.rejected || 0,
    }),
    [stats]
  );

  return (
    <section className="mt-2 mb-8">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={16} className="text-orange-500" />
        <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
          Admin Analytics
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <UsersPieChart stats={mergedStats} />
        <ActivityStatusBar stats={mergedStats} />
        <SummaryProgress stats={mergedStats} />
        <TopDepartmentsChart departmentData={departmentData} />
        <ActivityTrend monthlyData={monthlyData} />
      </div>
    </section>
  );
}