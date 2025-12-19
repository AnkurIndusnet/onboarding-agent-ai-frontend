import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import AddTaskModal from "./AddTaskModal";
import AddAnnouncementModal from "./AddAnnouncementModal";
import "./HRDashboard.css";

const hiringTrend = [
  { month: "Jan", hires: 5 },
  { month: "Feb", hires: 8 },
  { month: "Mar", hires: 12 },
  { month: "Apr", hires: 9 }
];

const HRDashboard = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  return (
    <div className="hr-dashboard">
      <h2>HR Dashboard</h2>

      {/* METRICS */}
      <div className="metrics">
        <div className="metric-card">Active Employees <strong>124</strong></div>
        <div className="metric-card">Pending Checklists <strong>18</strong></div>
        <div className="metric-card">Verification Required <strong>11</strong></div>
        <div className="metric-card">Unassigned New Hires <strong>6</strong></div>
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
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ACTIONS */}
      <div className="hr-actions">
        <button className="btn primary" onClick={() => setShowTaskModal(true)}>
          Add Task to Employee
        </button>

        <button className="btn secondary" onClick={() => setShowNoticeModal(true)}>
          Add Announcement
        </button>
      </div>

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
