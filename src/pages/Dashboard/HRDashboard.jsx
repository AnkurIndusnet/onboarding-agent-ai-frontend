import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import api from "../../common/api";
import AddTaskModal from "./AddTaskModal";
import AddAnnouncementModal from "./AddAnnouncementModal";
import "./HRDashboard.css";

const HRDashboard = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  const [metrics, setMetrics] = useState({
    activeEmployees: 0,
    pendingChecklists: 0,
    verificationRequired: 0,
    unassignedNewHires: 0
  });

  const [hiringTrend, setHiringTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------
     FETCH DASHBOARD DATA
  ---------------------------------- */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsRes, trendRes] = await Promise.all([
          api.get("/hr/dashboard/metrics"),
          api.get("/hr/dashboard/hiring-trend", {
            params: { year: new Date().getFullYear() }
          })
        ]);

        setMetrics(metricsRes.data || {});
        setHiringTrend(trendRes.data || []);
      } catch (err) {
        console.error("Failed to load HR dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="hr-dashboard">
      <h2>HR Dashboard</h2>

      {/* METRICS */}
      <div className="metrics">
        <div className="metric-card">
          Active Employees <strong>{metrics.activeEmployees}</strong>
        </div>

        <div className="metric-card">
          Pending Checklists <strong>{metrics.pendingChecklists}</strong>
        </div>

        <div className="metric-card">
          Verification Required <strong>{metrics.verificationRequired}</strong>
        </div>

        <div className="metric-card">
          Unassigned New Hires <strong>{metrics.unassignedNewHires}</strong>
        </div>
      </div>

      {/* TREND */}
      <div className="chart-card">
        <h4>New Hires Trend</h4>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={hiringTrend}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="hires"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        {!loading && hiringTrend.length === 0 && (
          <p style={{ marginTop: 12, color: "#6b7280" }}>
            No hiring data available for this year.
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="hr-actions">
        <button
          className="btn primary"
          onClick={() => setShowTaskModal(true)}
        >
          Add Task to Employee
        </button>

        <button
          className="btn secondary"
          onClick={() => setShowNoticeModal(true)}
        >
          Add Announcement
        </button>
      </div>

      {/* MODALS */}
      {showTaskModal && (
        <AddTaskModal onClose={() => setShowTaskModal(false)} />
      )}

      {showNoticeModal && (
        <AddAnnouncementModal onClose={() => setShowNoticeModal(false)} />
      )}
    </div>
  );
};

export default HRDashboard;
