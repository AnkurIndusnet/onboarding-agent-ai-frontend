import HRDashboard from "./HRDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const role = sessionStorage.getItem("role");

  if (role === "HR") {
    return <HRDashboard />;
  } 

  return <UserDashboard />;
};

export default Dashboard;
