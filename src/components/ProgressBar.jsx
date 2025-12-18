import "./ProgressBar.css";

const ProgressBar = ({ value }) => {
  return (
    <div className="progress-wrapper">
      <div className="progress-label">
        Readiness Score: <strong>{value}%</strong>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
