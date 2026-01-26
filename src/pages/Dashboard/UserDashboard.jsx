import "./UserDashboard.css";
import ProgressBar from "../../components/ProgressBar";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="dashboard">Loading...</div>;
  }

  // Frontend derived (can be moved to backend later)
  const readinessScore = Math.min(
    100,
    Math.round(
      (user.completedTask / Math.max(1, user.completedTask + user.pendingTask)) * 100
    )
  );

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">
        Welcome,  {user.name} 👋
      </h2>

      {/* Readiness section */}
      <div className="dashboard-section">
        <ProgressBar value={readinessScore} />
      </div>

      {/* Stats cards */}
      <div className="cards">
        <div className="card">
          <div className="card-label">Pending Tasks</div>
          <div className="card-value">{user.pendingTask}</div>
        </div>

        <div className="card">
          <div className="card-label">Completed Tasks</div>
          <div className="card-value">{user.completedTask}</div>
        </div>

        <div className="card highlight">
          <div className="card-label">Readiness Score</div>
          <div className="card-value">{readinessScore}%</div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
