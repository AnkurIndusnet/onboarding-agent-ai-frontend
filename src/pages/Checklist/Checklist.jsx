import "./Checklist.css";

const Checklist = () => {
  const checklist = [
    { id: 1, task: "Submit Aadhaar", status: "COMPLETED" },
    { id: 2, task: "Fill Bank Details", status: "PENDING" },
    { id: 3, task: "Sign NDA", status: "PENDING" }
  ];

  return (
    <div className="checklist">
      <h2>Onboarding Checklist</h2>

      {checklist.map(item => (
        <div key={item.id} className="check-item">
          <span>{item.task}</span>
          <span className={item.status.toLowerCase()}>
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Checklist;
