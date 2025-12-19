import HRDashboard from "./HRDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role === "HR") {
    return <HRDashboard />;
  }

  return <UserDashboard />;
};

export default Dashboard;
