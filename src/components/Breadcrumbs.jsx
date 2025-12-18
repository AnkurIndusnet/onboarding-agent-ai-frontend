import { Link } from "react-router-dom";
import "./Breadcrumbs.css";

const Breadcrumbs = ({ path }) => {
  const crumbs = path.split("/").filter(Boolean);

  return (
    <div className="breadcrumbs">
      <Link to="/dashboard">Home</Link>
      {crumbs.map((c, i) => {
        const route = "/" + crumbs.slice(0, i + 1).join("/");
        return (
          <span key={i}>
            <span className="sep">/</span>
            <Link to={route}>{format(c)}</Link>
          </span>
        );
      })}
    </div>
  );
};

const format = (text) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export default Breadcrumbs;
