import { useState } from "react";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import "./HrPanel.css";

const HrPanel = () => {
  const employees = [
    { id: 1, name: "Amit Sharma", score: 72, status: "IN_PROGRESS" },
    { id: 2, name: "Neha Verma", score: 90, status: "COMPLETED" }
  ];

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <div className="hr-panel">
      <h2>HR Command Center</h2>

      {employees.map(emp => (
        <div key={emp.id} className="employee-row">
          <div>
            <strong>{emp.name}</strong>
            <div className="muted">
              Readiness: {emp.score}% · {emp.status}
            </div>
          </div>

          <button
            className="primary"
            onClick={() => setSelectedEmployee(emp)}
          >
            {emp.status === "COMPLETED" ? "View" : "Details"}
          </button>
        </div>
      ))}

      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default HrPanel;
