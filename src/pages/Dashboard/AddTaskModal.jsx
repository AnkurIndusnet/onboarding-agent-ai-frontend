import { useState } from "react";
import MultiSelectDropdown from "../../common/MultiSelectDropdown";
import { TASK_PRESETS } from "./dashboardPresets";
import "./AddTaskModal.css";

const AddTaskModal = ({ onClose }) => {
  const [taskType, setTaskType] = useState([]);
  const [presets, setPresets] = useState([]);
  const [employees, setEmployees] = useState([]);

  return (
    <div className="task-modal-backdrop">
      <div className="task-modal">
        <h3>Assign Task</h3>

        <div className="task-modal-body">
          <MultiSelectDropdown
            label="Task Type"
            placeholder="Select task type"
            options={["DOCUMENT", "ESIGN", "TRAINING"]}
            selected={taskType}
            setSelected={setTaskType}
          />

          <MultiSelectDropdown
            label="Presets"
            placeholder="Select presets"
            options={taskType.flatMap(t => TASK_PRESETS[t] || [])}
            selected={presets}
            setSelected={setPresets}
          />

          <MultiSelectDropdown
            label="Employees"
            placeholder="Search employees"
            options={["Amit Sharma", "Neha Verma", "Rahul Singh"]}
            selected={employees}
            setSelected={setEmployees}
            searchable
          />
        </div>

        <div className="task-modal-footer">
          <button className="btn success">Assign</button>
          <button className="btn secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
