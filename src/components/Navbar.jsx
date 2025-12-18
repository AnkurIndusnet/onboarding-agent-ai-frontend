import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null; // hide navbar if not logged in

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="brand">OnboardAI</span>
      </div>

      <div className="navbar-center">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/chatbot">Chatbot</Link>
        <Link to="/checklist">Checklist</Link>
        <Link to="/documents">Documents</Link>
        <Link to="/progress">Progress</Link>

        {user.role === "HR" && <Link to="/hr">HR Panel</Link>}
      </div>

      <div className="navbar-right">
        <span className="user">{user.name}</span>
        <button className="logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
