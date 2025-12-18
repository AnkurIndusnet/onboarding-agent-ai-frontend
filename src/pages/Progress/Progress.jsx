import "./Progress.css";

const Progress = () => {
  const completed = 6;
  const total = 10;
  const score = Math.round((completed / total) * 100);

  return (
    <div className="progress">
      <h2>Progress</h2>
      <p>{completed} / {total} completed</p>
      <p>Readiness Score: {score}%</p>
    </div>
  );
};

export default Progress;
