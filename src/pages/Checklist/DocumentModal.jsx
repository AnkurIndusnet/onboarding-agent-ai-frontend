import { useRef, useState } from "react";
import Tesseract from "tesseract.js";
import "./Modal.css";

const DocumentModal = ({ item, onClose, onSuccess }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach(t => t.stop());
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const img = canvas.toDataURL("image/png");
    stopCamera();
    processOCR(img);
  };

  const processOCR = async (img) => {
    setImage(img);
    setLoading(true);
    setOcrText("");

    const res = await Tesseract.recognize(img, "eng");
    setOcrText(res.data.text);
    setLoading(false);
  };

  const save = () => {
    setTimeout(onSuccess, 500);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{item.task}</h3>

        <div className="modal-body">
          <p className="modal-hint">
            Capture a clear photo of your Aadhaar card.
          </p>

          <div className="modal-section">
            {!image && (
              <div className="camera-frame">
                <video ref={videoRef} autoPlay playsInline muted />
                <div className="camera-actions">
                  <button onClick={startCamera}>Open Camera</button>
                  <button onClick={capture}>Capture</button>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} hidden />

            {loading && <p>Extracting text…</p>}

            {ocrText && (
              <>
                <label>Extracted Text</label>
                <textarea
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                />
              </>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={save} disabled={!ocrText || loading}>
            Save & Continue
          </button>
          <button className="close" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
