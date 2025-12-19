import { useState } from "react";
import "./AddAnnouncementModal.css";

const AddAnnouncementModal = ({ onClose }) => {
  const [message, setMessage] = useState("");

  return (
    <div className="announce-modal-backdrop">
      <div className="announce-modal">
        <h3>Add Announcement</h3>

        <div className="announce-modal-body">
          <p className="announce-modal-hint">
            This announcement will be visible to all selected employees.
          </p>

          <div className="announce-modal-section">
            <div className="announce-field">
              <label>Announcement Message</label>
              <textarea
                placeholder="Write announcement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="announce-modal-footer">
          <button className="btn success">Publish</button>
          <button className="btn secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAnnouncementModal;
