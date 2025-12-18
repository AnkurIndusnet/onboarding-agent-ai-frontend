import { useState } from "react";
import DocumentModal from "./DocumentModal";
import FormModal from "./FormModal";
import "./Checklist.css";

const Checklist = () => {
  const [checklist, setChecklist] = useState([
    { id: 1, task: "Submit Aadhaar", type: "DOCUMENT", status: "PENDING" },
    { id: 2, task: "Fill Bank Details", type: "FORM", status: "PENDING" },
    { id: 3, task: "Sign NDA", type: "DOCUMENT", status: "COMPLETED" }
  ]);

  const [activeItem, setActiveItem] = useState(null);

  const markCompleted = (id) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: "COMPLETED" } : item
      )
    );
    setActiveItem(null);
  };

  return (
    <div className="checklist">
      <h2>Onboarding Checklist</h2>

      {checklist.map(item => (
        <div key={item.id} className="check-item">
          <span>{item.task}</span>

          {item.status === "PENDING" ? (
            <button onClick={() => setActiveItem(item)}>
              {item.type === "DOCUMENT" ? "Upload" : "Fill out now"}
            </button>
          ) : (
            <span className="completed">COMPLETED</span>
          )}
        </div>
      ))}

      {activeItem?.type === "DOCUMENT" && (
        <DocumentModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onSuccess={() => markCompleted(activeItem.id)}
        />
      )}

      {activeItem?.type === "FORM" && (
        <FormModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onSuccess={() => markCompleted(activeItem.id)}
        />
      )}
    </div>
  );
};

export default Checklist;
