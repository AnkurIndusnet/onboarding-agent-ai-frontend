import { useState } from "react";
import "../Checklist/modal.css";

const AddAnnouncementModal = ({ onClose }) => {
  const [message, setMessage] = useState("");

  return (
    <div className="modal-backdrop modal-opening">
      <div className="modal modal-opening">
        <h3>Add Announcement</h3>

        <div className="modal-body">
          <textarea
            placeholder="Write announcement..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button className="btn success">Publish</button>
          <button className="close" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddAnnouncementModal;
