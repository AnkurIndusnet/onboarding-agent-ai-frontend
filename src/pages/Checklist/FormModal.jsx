import { useState, useEffect } from "react";
import api from "../../common/api";
import "./modal.css";

const FormModal = ({ item, fields, onClose, onSuccess }) => {
  const [formFields, setFormFields] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  /* ----------------------------------
     INIT LOCAL STATE FROM FIELD API
  ---------------------------------- */
  useEffect(() => {
    setFormFields(
      (fields || []).map(f => ({
        fieldId: f.fieldId,        // ✅ from FIELD API
        label: f.label,
        required: f.required,
        readOnly: f.readOnly,
        value: f.value ?? ""
      }))
    );
  }, [fields]);

  /* ----------------------------------
     UPDATE FIELD VALUE
  ---------------------------------- */
  const updateValue = (fieldId, value) => {
    setFormFields(prev =>
      prev.map(f =>
        f.fieldId === fieldId
          ? { ...f, value }
          : f
      )
    );
  };

  /* ----------------------------------
     SUBMIT FORM (FINAL PAYLOAD)
  ---------------------------------- */
  const save = async () => {
    if (submitting) return;

    setSubmitting(true);

    try {
      await api.post(
        `/employee/checklist/submit`,
        {
          taskId: item.taskId,
          values: formFields.map(f => ({
            fieldId: f.fieldId,
            value:
              typeof f.value === "string"
                ? f.value.trim()
                : f.value
          }))
        }
      );

      onSuccess(); 
    } catch (err) {
      alert("Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  /* ----------------------------------
     CLOSE MODAL
  ---------------------------------- */
  const close = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  /* ----------------------------------
     VALIDATION
  ---------------------------------- */
  const isValid =
    formFields.length > 0 &&
    formFields.every(
      f => !f.required || String(f.value || "").trim()
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
                  disabled={f.readOnly || submitting}
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

          <button
            className="close"
            onClick={close}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
