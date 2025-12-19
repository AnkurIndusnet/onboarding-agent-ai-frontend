import { useEffect, useState } from "react";
import "./EmployeeMultiSelect.css";

const mockEmployees = [
  { id: 1, name: "Amit Sharma" },
  { id: 2, name: "Neha Verma" },
  { id: 3, name: "Rahul Singh" }
];

const EmployeeMultiSelect = ({ selected, setSelected }) => {
  const [query, setQuery] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // simulate API call
    setEmployees(
      mockEmployees.filter(e =>
        e.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query]);

  const toggle = (emp) => {
    setSelected(prev =>
      prev.some(e => e.id === emp.id)
        ? prev.filter(e => e.id !== emp.id)
        : [...prev, emp]
    );
  };

  return (
    <div className="emp-select">
      <input
        placeholder="Search employees..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="emp-options">
        {employees.map(emp => (
          <label key={emp.id}>
            <input
              type="checkbox"
              checked={selected.some(e => e.id === emp.id)}
              onChange={() => toggle(emp)}
            />
            {emp.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default EmployeeMultiSelect;
