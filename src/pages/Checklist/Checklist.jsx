import { useState } from "react";
import { useChecklist } from "../../context/ChecklistContext";
import api from "../../common/api";
import DocumentModal from "./DocumentModal";
import FormModal from "./FormModal";
import "./Checklist.css";

const Checklist = () => {
  const { checklist, setChecklist } = useChecklist();

  const [activeItem, setActiveItem] = useState(null);
  const [activeFields, setActiveFields] = useState([]);
  const [activeMode, setActiveMode] = useState(null); // FORM | DOCUMENT
  const [loading, setLoading] = useState(false);

  const markCompleted = (taskId) => {
    setChecklist(prev =>
      prev.map(item =>
        item.taskId === taskId
          ? { ...item, submissionDateTime: new Date().toISOString() }
          : item
      )
    );
    closeModal();
  };

  const closeModal = () => {
    setActiveItem(null);
    setActiveFields([]);
    setActiveMode(null);
  };

  /**
   * 🔥 THIS IS THE FIX
   * Fetch fields and decide modal type dynamically
   */
  const proceedTask = async (item) => {
    try {
      setLoading(true);

      const res = await api.get(
        `/employee/checklist/${item.taskId}/fields`
      );

      const fields = res.data || [];

      if (fields.length === 0) {
        alert("No fields configured for this task");
        return;
      }

      const hasDocument = fields.some(f => f.type === "DOCUMENT");
      const hasText = fields.some(f => f.type === "TEXT");

      if (hasDocument && !hasText) {
        setActiveMode("DOCUMENT");
      } else {
        // TEXT or mixed → FORM (future-proof)
        setActiveMode("FORM");
      }

      setActiveFields(fields);
      setActiveItem(item);
    } catch (err) {
      alert("Failed to load task details");
    } finally {
      setLoading(false);
    }
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
              <button
                disabled={loading}
                onClick={() => proceedTask(item)}
              >
                Proceed
              </button>
            ) : (
              <span className="completed">COMPLETED</span>
            )}
          </div>
        );
      })}

      {/* DOCUMENT MODAL */}
      {activeMode === "DOCUMENT" && (
        <DocumentModal
          item={activeItem}
          fields={activeFields}
          onClose={closeModal}
          onSuccess={() => markCompleted(activeItem.taskId)}
        />
      )}

      {/* FORM MODAL */}
      {activeMode === "FORM" && (
        <FormModal
          item={activeItem}
          fields={activeFields}
          onClose={closeModal}
          onSuccess={() => markCompleted(activeItem.taskId)}
        />
      )}
    </div>
  );
};

export default Checklist;
