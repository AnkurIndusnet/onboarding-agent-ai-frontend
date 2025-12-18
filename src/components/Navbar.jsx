import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Breadcrumbs from "./Breadcrumbs";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, setDark } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ✅ Hooks MUST be called unconditionally */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return null;

  const logout = () => {
  localStorage.removeItem("user");
  document.body.classList.remove("dark");
  localStorage.removeItem("theme");
  navigate("/");
};

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-left">
          <span className="brand">OnboardAI</span>
        </div>

        {/* DESKTOP NAV */}
        <div className="navbar-center">
          <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
          <NavLink to="/chatbot" className="nav-link">Chatbot</NavLink>
          <NavLink to="/checklist" className="nav-link">Checklist</NavLink>
          <NavLink to="/documents" className="nav-link">Documents</NavLink>
          <NavLink to="/progress" className="nav-link">Progress</NavLink>
          {user.role === "HR" && (
            <NavLink to="/hr" className="nav-link">HR Panel</NavLink>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="navbar-right">
          <button
            className="theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? "🌞" : "🌙"}
          </button>

          <span className="user">{user.name}</span>

          <button className="logout" onClick={logout}>
            Logout
          </button>

          {/* HAMBURGER */}
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            ☰
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* BACKDROP */}
      {menuOpen && (
        <div className="menu-backdrop" onClick={closeMenu} />
      )}

      {/* SIDE DRAWER (MOBILE) */}
      <div className={`side-drawer ${menuOpen ? "open" : ""}`}>
        <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
        <NavLink to="/chatbot" onClick={closeMenu}>Chatbot</NavLink>
        <NavLink to="/checklist" onClick={closeMenu}>Checklist</NavLink>
        <NavLink to="/documents" onClick={closeMenu}>Documents</NavLink>
        <NavLink to="/progress" onClick={closeMenu}>Progress</NavLink>
        {user.role === "HR" && (
          <NavLink to="/hr" onClick={closeMenu}>HR Panel</NavLink>
        )}
      </div>

      {/* BREADCRUMBS */}
      <Breadcrumbs path={location.pathname} />
    </>
  );
};

export default Navbar;
