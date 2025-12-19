import { useEffect, useState } from "react";
import "./modal.css";

const FormModal = ({ item, onClose, onSuccess }) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFields([
        { id: 1, label: "IFSC Code", type: "text", status: 0, value: "" },
        { id: 2, label: "Account Number", type: "text", status: 1, value: "3490908908" },
        { id: 3, label: "Bank Address", type: "text", status: 0, value: "" }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const updateValue = (id, value) => {
    setFields(prev =>
      prev.map(f => (f.id === id ? { ...f, value } : f))
    );
  };

  const save = () => {
    setTimeout(onSuccess, 500);
  };

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  return (
    <div className={`modal-backdrop ${closing ? "modal-closing" : "modal-opening"}`}>
      <div className={`modal ${closing ? "modal-closing" : "modal-opening"}`}>
        <h3>{item.task}</h3>

        <div className="modal-body">
          <p className="modal-hint">
            Fill required details. Read-only fields are already verified.
          </p>

          <div className="modal-section">
            {loading && <p>Loading form…</p>}

            {!loading &&
              fields.map(f => (
                <div key={f.id} className="form-field">
                  <label>{f.label}</label>
                  <input
                    type={f.type}
                    value={f.value}
                    disabled={f.status === 1}
                    onChange={(e) => updateValue(f.id, e.target.value)}
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={save} disabled={loading}>
            Save & Continue
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
