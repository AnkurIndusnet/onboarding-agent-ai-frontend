import { useEffect, useState } from "react";
import api from "../../common/api";
import "./modal.css";

const FormModal = ({ item, onClose, onSuccess }) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  // 🔹 Fetch form fields dynamically
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.get(
          `/employee/checklist/${item.taskId}/fields`
        );
        setFields(res.data);
      } catch (err) {
        console.error("Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [item.taskId]);

  const updateValue = (fieldId, value) => {
    setFields(prev =>
      prev.map(f =>
        f.fieldId === fieldId ? { ...f, value } : f
      )
    );
  };

  const save = async () => {
    setSubmitting(true);

    try {
      await api.post(
        `/employee/checklist/${item.taskId}/form`,
        {
          fields: fields.map(f => ({
            fieldId: f.fieldId,
            value: f.value
          }))
        }
      );

      onSuccess(); // ✔ updates checklist context
    } catch (err) {
      alert("Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  const isValid =
    fields.length > 0 &&
    fields.every(f => !f.required || f.value?.trim());

  return (
    <div
      className={`modal-backdrop ${
        closing ? "modal-closing" : "modal-opening"
      }`}
    >
      <div
        className={`modal ${
          closing ? "modal-closing" : "modal-opening"
        }`}
      >
        <h3>{item.task}</h3>

        <div className="modal-body">
          <p className="modal-hint">
            Please complete the required details below.
          </p>

          <div className="modal-section">
            {loading && <p>Loading form…</p>}

            {!loading &&
              fields.map(f => (
                <div key={f.fieldId} className="form-field">
                  <label>
                    {f.label}
                    {f.required && " *"}
                  </label>
                  <input
                    type={f.type || "text"}
                    value={f.value || ""}
                    disabled={f.readOnly}
                    onChange={(e) =>
                      updateValue(f.fieldId, e.target.value)
                    }
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={save}
            disabled={!isValid || submitting}
          >
            {submitting ? "Saving…" : "Save & Continue"}
          </button>

          <button className="close" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
