import { useState } from "react";
import { useChecklist } from "../../context/ChecklistContext";
import DocumentModal from "./DocumentModal";
import FormModal from "./FormModal";
import "./Checklist.css";

const Checklist = () => {
  const { checklist, setChecklist } = useChecklist();
  const [activeItem, setActiveItem] = useState(null);

  /**
   * Mark task completed locally after successful modal action.
   * Backend call should already be done inside modal.
   */
  const markCompleted = (taskId) => {
    setChecklist(prev =>
      prev.map(item =>
        item.taskId === taskId
          ? { ...item, submissionDateTime: new Date().toISOString() }
          : item
      )
    );
    setActiveItem(null);
  };

  if (!checklist || checklist.length === 0) {
    return (
      <div className="checklist">
        <h2>Onboarding Checklist</h2>
        <p>No tasks available yet.</p>
      </div>
    );
  }

  return (
    <div className="checklist">
      <h2>Onboarding Checklist</h2>

      {checklist.map(item => {
        const isCompleted = !!item.submissionDateTime;

        return (
          <div key={item.taskId} className="check-item">
            <span>{item.task}</span>

            {!isCompleted ? (
              <button onClick={() => setActiveItem(item)}>
                {item.type === "DOCUMENT" ? "Upload" : "Proceed"}
              </button>
            ) : (
              <span className="completed">COMPLETED</span>
            )}
          </div>
        );
      })}

      {/* DOCUMENT MODAL */}
      {activeItem?.type === "DOCUMENT" && (
        <DocumentModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onSuccess={() => markCompleted(activeItem.taskId)}
        />
      )}

      {/* FORM / ADMIN / SETUP / ORIENTATION */}
      {activeItem &&
        activeItem.type !== "DOCUMENT" && (
          <FormModal
            item={activeItem}
            onClose={() => setActiveItem(null)}
            onSuccess={() => markCompleted(activeItem.taskId)}
          />
        )}
    </div>
  );
};

export default Checklist;
