import { useState } from "react";
import "./EmployeeDetailsModal.css";
import "../Checklist/modal.css";
import {
  Bell,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  Download
} from "lucide-react";

const data = {
  documentSubmission: [
    {
      title: "Aadhaar Card",
      status: "Completed",
      documentNo: "365698599659",
      fileName: "aadhaar_amit.jpg"
    },
    {
      title: "PAN Card",
      status: "Pending",
      documentNo: "",
      fileName: ""
    }
  ],
  eSignature: [
    {
      title: "LOI Letter",
      status: "Completed",
      documentNo: "14ADDB252",
      fileName: "loi_amit.pdf"
    }
  ],
  trainings: [
    {
      title: "Company Policy",
      status: "Verified",
      documentNo: "",
      fileName: ""
    }
  ]
};

const EmployeeDetailsModal = ({ employee, onClose }) => {
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  const action = (type, item) => {
    console.log("API CALL:", type, item.fileName);
  };

  const renderActions = (item) => (
  <div className="actions">
    {item.status === "Pending" && (
      <button className="btn info" onClick={() => action("reminder", item)}>
        <Bell size={16} /> Reminder
      </button>
    )}

    {item.status === "Completed" && (
      <>
       <button
          className="btn success mobile-icon-only"
          onClick={() => action("accept", item)}
        >
          <CheckCircle size={16} />
          <span>Accept</span>
        </button>


        <button
          className="btn danger mobile-icon-only"
          onClick={() => action("reject", item)}
        >
          <XCircle size={16} />
          <span>Reject</span>
        </button>

        <button
          className="btn warning mobile-icon-only"
          onClick={() => action("rework", item)}
        >
          <RotateCcw size={16} />
          <span>Rework</span>
        </button>
      </>
    )}

    {item.status === "Verified" && (
      <button
        className="btn secondary mobile-icon-only"
        onClick={() => action("preview", item)}
      >
        <Eye size={16} />
        <span>Preview</span>
      </button>
    )}

    {item.fileName && (
      <>
        <button className="btn secondary" onClick={() => action("preview", item)}>
          <Eye size={16} /> Preview
        </button>

        <button className="btn secondary" onClick={() => action("download", item)}>
          <Download size={16} /> Download
        </button>
      </>
    )}
  </div>
);

  
  const renderSection = (title, items) => (
    <div className="section">
      <h4>{title}</h4>
      {items.map((item, i) => (
        <div key={i} className="step">
          <div className="step-header">
            <span>{item.title}</span>
            <span className={`status ${item.status.toLowerCase()}`}>
              {item.status}
            </span>
          </div>

          {item.documentNo && (
            <div className="doc-no">Doc No: {item.documentNo}</div>
          )}

          {renderActions(item)}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`modal-backdrop ${closing ? "modal-closing" : "modal-opening"}`}>
      <div className={`modal ${closing ? "modal-closing" : "modal-opening"}`}>
        <h3>{employee.name} · Onboarding Progress</h3>

        <div className="modal-body">
          {renderSection("Document Submission", data.documentSubmission)}
          {renderSection("E-Signature", data.eSignature)}
          {renderSection("Trainings", data.trainings)}
        </div>

        <div className="modal-footer">
          <button className="close" onClick={close}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
