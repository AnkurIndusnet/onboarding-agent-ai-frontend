import { useRef, useState } from "react";
import Tesseract from "tesseract.js";
import "./Modal.css";

const DocumentModal = ({ item, onClose, onSuccess }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);

  /* ---------- CAMERA ---------- */
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setCameraStarted(true);
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
    setCameraStarted(false);
    processOCR(img);
  };

  /* ---------- OCR ---------- */
  const processOCR = async (img) => {
    setImage(img);
    setLoading(true);
    setOcrText("");

    const res = await Tesseract.recognize(img, "eng");
    setOcrText(res.data.text);
    setLoading(false);
  };

  /* ---------- RE-CAPTURE ---------- */
  const recapture = () => {
    setImage(null);
    setOcrText("");
    setLoading(false);
    startCamera();
  };

  /* ---------- SAVE ---------- */
  const save = () => {
    // simulate API 200
    setTimeout(onSuccess, 500);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {/* HEADER */}
        <h3>{item.task}</h3>

        {/* BODY */}
        <div className="modal-body">
          <p className="modal-hint">
            Capture a clear photo of your Aadhaar card.
          </p>

          <div className="modal-section">
            {/* CAMERA OR IMAGE */}
            {!image ? (
              <div className="camera-frame">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                />

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

                {/* RE-CAPTURE BUTTON (OUTSIDE IMAGE PREVIEW) */}
                <button className="recapture-btn" onClick={recapture}>
                  Re-capture
                </button>
              </>
            )}

            <canvas ref={canvasRef} hidden />

            {/* OCR RESULT */}
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

        {/* FOOTER */}
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
