import "./Dashboard.css";

const Dashboard = () => {
  const dashboardData = {
    readinessScore: 72,
    pendingTasks: 4,
    completedTasks: 6
  };

  return (
    <div className="dashboard">
      <h2>Welcome, Amit 👋</h2>

      <div className="cards">
        <div className="card">Readiness Score: {dashboardData.readinessScore}%</div>
        <div className="card">Pending Tasks: {dashboardData.pendingTasks}</div>
        <div className="card">Completed Tasks: {dashboardData.completedTasks}</div>
      </div>
    </div>
  );
};

export default Dashboard;
