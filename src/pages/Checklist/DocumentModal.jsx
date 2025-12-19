import { useRef, useState } from "react";
import Tesseract from "tesseract.js";
import "./modal.css";

const DocumentModal = ({ item, onClose, onSuccess }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [closing, setClosing] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setCameraStarted(true);
  };

  const stopCamera = () => {
    videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    stopCamera();
    setCameraStarted(false);
    processOCR(canvas.toDataURL("image/png"));
  };

  const processOCR = async (img) => {
    setImage(img);
    setLoading(true);
    const res = await Tesseract.recognize(img, "eng");
    setOcrText(res.data.text);
    setLoading(false);
  };

  const recapture = () => {
    setImage(null);
    setOcrText("");
    startCamera();
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
            Capture a clear photo of your Aadhaar card.
          </p>

          <div className="modal-section">
            {!image ? (
              <div className="camera-frame">
                <video ref={videoRef} autoPlay playsInline muted />
                <div className="camera-actions">
                  {!cameraStarted ? (
                    <button onClick={startCamera}>Open Camera</button>
                  ) : (
                    <button onClick={capture}>Capture</button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="image-preview">
                  <img src={image} alt="Captured Aadhaar" />
                </div>

                <button className="recapture-btn" onClick={recapture}>
                  Re-capture
                </button>
              </>
            )}

            <canvas ref={canvasRef} hidden />

            {loading && <p>Extracting text…</p>}

            {ocrText && (
              <div className="ocr-result">
                <label>Extracted Text</label>
                <textarea
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={save} disabled={!ocrText || loading}>
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

export default DocumentModal;
