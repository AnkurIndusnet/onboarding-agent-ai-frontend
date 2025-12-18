import { useRef, useState } from "react";
import "./Documents.css";

const Documents = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [loading, setLoading] = useState(false);

  /* Start camera */
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  /* Capture photo */
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);

    // stop camera
    video.srcObject.getTracks().forEach(track => track.stop());

    simulateOCR();
  };

  /* Simulated OCR (replace with API later) */
  const simulateOCR = () => {
    setLoading(true);

    setTimeout(() => {
      setOcrData({
        name: "Amit Sharma",
        dob: "12-08-1996",
        idNumber: "XXXX-XXXX-4321"
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="documents">
      <h2>Document OCR</h2>

      {/* Camera */}
      {!image && (
        <div className="camera-box">
          <video ref={videoRef} autoPlay playsInline />
          <button onClick={startCamera}>Open Camera</button>
          <button onClick={captureImage}>Capture</button>
        </div>
      )}

      {/* Hidden canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Image preview */}
      {image && (
        <div className="preview-box">
          <img src={image} alt="Captured document" />
        </div>
      )}

      {/* OCR Processing */}
      {loading && <p className="loading">Processing OCR...</p>}

      {/* OCR Result */}
      {ocrData && (
        <div className="ocr-card">
          <h3>Extracted Details</h3>

          <div className="field">
            <span>Name</span>
            <strong>{ocrData.name}</strong>
          </div>

          <div className="field">
            <span>Date of Birth</span>
            <strong>{ocrData.dob}</strong>
          </div>

          <div className="field">
            <span>ID Number</span>
            <strong>{ocrData.idNumber}</strong>
          </div>

          <button className="confirm">Confirm & Save</button>
        </div>
      )}
    </div>
  );
};

export default Documents;
