import { ThemeProvider } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  return (
    <ThemeProvider>
      <Navbar />
     <main className="dashboard-content">
  <div className="dashboard-wrapper">
    {children}
  </div>
</main>

    </ThemeProvider>
  );
};

export default DashboardLayout;
