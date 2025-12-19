import "./UserDashboard.css";
import ProgressBar from "../../components/ProgressBar";

const Dashboard = () => {
  const dashboardData = {
    readinessScore: 72,
    pendingTasks: 4,
    completedTasks: 6
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Welcome, Amit 👋</h2>

      {/* Readiness section */}
      <div className="dashboard-section">
        <ProgressBar value={dashboardData.readinessScore} />
      </div>

      {/* Stats cards */}
      <div className="cards">
        <div className="card">
          <div className="card-label">Pending Tasks</div>
          <div className="card-value">{dashboardData.pendingTasks}</div>
        </div>

        <div className="card">
          <div className="card-label">Completed Tasks</div>
          <div className="card-value">{dashboardData.completedTasks}</div>
        </div>

        <div className="card highlight">
          <div className="card-label">Readiness Score</div>
          <div className="card-value">
            {dashboardData.readinessScore}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
