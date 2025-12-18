import "./HrPanel.css";

const HrPanel = () => {
  const employees = [
    { name: "Amit Sharma", score: 72, status: "IN_PROGRESS" },
    { name: "Neha Verma", score: 90, status: "COMPLETED" }
  ];

  return (
    <div className="hr-panel">
      <h2>HR Admin Panel</h2>

      {employees.map((e, i) => (
        <div key={i} className="employee">
          {e.name} — {e.score}% — {e.status}
        </div>
      ))}
    </div>
  );
};

export default HrPanel;
