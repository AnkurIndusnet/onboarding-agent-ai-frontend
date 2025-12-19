import { useState } from "react";
import { TASK_PRESETS } from "./dashboardPresets";
import "../Checklist/modal.css";

const AddTaskModal = ({ onClose }) => {
  const [type, setType] = useState("DOCUMENT");

  return (
    <div className="modal-backdrop modal-opening">
      <div className="modal modal-opening">
        <h3>Assign Task</h3>

        <div className="modal-body">
          <label>Task Type</label>
          <select onChange={(e) => setType(e.target.value)}>
            <option value="DOCUMENT">Document Upload</option>
            <option value="ESIGN">E-Signature</option>
            <option value="TRAINING">Training</option>
          </select>

          <label>Preset Tasks</label>
          <ul>
            {TASK_PRESETS[type].map(t => <li key={t}>{t}</li>)}
          </ul>
        </div>

        <div className="modal-footer">
          <button className="btn success">Assign</button>
          <button className="close" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
