import { useState, useEffect } from "react";
import api from "../../common/api";
import "./modal.css";

const FormModal = ({ item, fields, onClose, onSuccess }) => {
  // Local editable copy
  const [formFields, setFormFields] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  // Initialize local state from props
  useEffect(() => {
    setFormFields(
      (fields || []).map(f => ({
        ...f,
        value: f.value || ""
      }))
    );
  }, [fields]);

  const updateValue = (fieldId, value) => {
    setFormFields(prev =>
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
          fields: formFields.map(f => ({
            fieldId: f.fieldId,
            value: f.value
          }))
        }
      );

      onSuccess(); // updates checklist context
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
    formFields.length > 0 &&
    formFields.every(
      f => !f.required || f.value?.trim()
    );

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
            {formFields.length === 0 && (
              <p>No fields configured for this task.</p>
            )}

            {formFields.map(f => (
              <div key={f.fieldId} className="form-field">
                <label>
                  {f.label}
                  {f.required && " *"}
                </label>

                <input
                  type="text"
                  value={f.value}
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
