import { useRef, useState, useEffect } from "react";
import api from "../../common/api";
import { resolveDocumentType } from "../../common/documentTypeMapper";
import "./DocumentModal.css";
import {
  Camera,
  Aperture,
  RotateCcw,
  Save,
  X,
  Upload
} from "lucide-react";

const DocumentUpload = ({ item, fields, onClose, onSuccess }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [docs, setDocs] = useState([]);
  const [activeField, setActiveField] = useState(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);

  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [closing, setClosing] = useState(false);

  // 🔥 FINAL COLLECTED VALUES (FOR SUBMIT)
  const [collectedValues, setCollectedValues] = useState([]);

  /* ----------------------------------
     INIT DOCUMENT STATE
  ---------------------------------- */
  useEffect(() => {
    setDocs(
      (fields || []).map(f => ({
        ...f,
        uploaded: false,
        preview: null,
        validation: null
      }))
    );
  }, [fields]);

  /* ----------------------------------
     ATTACH STREAM SAFELY
  ---------------------------------- */
  useEffect(() => {
    if (cameraOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraOpen, stream]);

  /* ----------------------------------
     CAMERA CONTROLS
  ---------------------------------- */
  const openCamera = async (field) => {
    if (processing) return;

    const documentType = resolveDocumentType(field.label);
    if (!documentType) {
      alert(`No documentType mapping for "${field.label}"`);
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      setActiveField({ ...field, documentType });
      setStream(mediaStream);
      setCameraOpen(true);
    } catch {
      alert("Camera access denied");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setCameraOpen(false);
  };

  /* ----------------------------------
     CAMERA CAPTURE
  ---------------------------------- */
  const capture = async () => {
    if (!videoRef.current || !canvasRef.current || !activeField) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    stopCamera();

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      await uploadAndValidate(blob, activeField);
    }, "image/jpeg", 0.7);
  };

  /* ----------------------------------
     FILE UPLOAD (JPEG ONLY)
  ---------------------------------- */
  const handleFileUpload = async (file, field) => {
    if (processing) return;

    if (!["image/jpeg", "image/jpg"].includes(file.type)) {
      alert("Only JPEG images are allowed");
      return;
    }

    const documentType = resolveDocumentType(field.label);
    if (!documentType) {
      alert(`No documentType mapping for "${field.label}"`);
      return;
    }

    await uploadAndValidate(file, { ...field, documentType });
  };

  /* ----------------------------------
     SHARED UPLOAD + VALIDATION
  ---------------------------------- */
  const uploadAndValidate = async (fileOrBlob, field) => {
    setProcessing(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", fileOrBlob);
      formData.append("documentType", field.documentType);

      const res = await api.post(
        "/employee/document/validate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) {
              const percent = Math.round((e.loaded * 100) / e.total);
              setUploadProgress(percent);
            }
          }
        }
      );

      const validation = res.data;

      /* -------------------------------
         STORE EXTRACTED VALUES (JSON)
      -------------------------------- */
      if (validation?.extractedFields) {
              setCollectedValues(prev => {
          // remove old value for same field
          const filtered = prev.filter(
            v => v.fieldId !== field.fieldId
          );

          return [
            ...filtered,
            {
              fieldId: field.fieldId,  
              value: validation.extractedFields.id,
            }
          ];
        }); 

      
      }

      /* -------------------------------
         UPDATE UI STATE
      -------------------------------- */
      setDocs(prev =>
        prev.map(d =>
          d.fieldId === field.fieldId
            ? {
                ...d,
                uploaded: true,
                preview: URL.createObjectURL(fileOrBlob),
                validation
              }
            : d
        )
      );
    } catch {
      alert("Document validation failed");
    } finally {
      setProcessing(false);
      setUploadProgress(0);
      setActiveField(null);
    }
  };

  const recapture = (field) => {
    if (processing) return;

    setDocs(prev =>
      prev.map(d =>
        d.fieldId === field.fieldId
          ? { ...d, uploaded: false, preview: null, validation: null }
          : d
      )
    );
    openCamera(field);
  };

  /* ----------------------------------
     FINAL SAVE (REAL PAYLOAD)
  ---------------------------------- */
  const save = async () => {
    const payload = {
      taskId: item.taskId,
      values: collectedValues
    };

    console.log("FINAL SUBMIT PAYLOAD:", payload);

     await api.post(`/employee/checklist/submit`, payload);

    onSuccess();
  };

  const close = () => {
    setClosing(true);
    stopCamera();
    setTimeout(onClose, 200);
  };

  const allRequiredUploaded = docs.every(
    d => !d.required || d.uploaded
  );

  return (
    <div className={`modal-backdrop ${closing ? "modal-closing" : "modal-opening"}`}>
      <div className={`modal ${closing ? "modal-closing" : "modal-opening"}`}>
        <h3>{item.task}</h3>

        <div className="modal-body">
          <p className="modal-hint">
            Upload the required documents below (JPEG only).
          </p>

          {processing && (
            <div className="upload-progress">
              <div
                className="upload-bar"
                style={{ width: `${uploadProgress}%` }}
              />
              <span>{uploadProgress}%</span>
            </div>
          )}

          <div className="modal-section">
            {docs.map(field => (
              <div
                key={field.fieldId}
                className={`doc-item ${field.uploaded ? "done" : ""}`}
              >
                <div className="doc-header">
                  <span className="doc-title">
                    {field.label}
                    {field.required && " *"}
                  </span>

                  {!field.uploaded && (
                    <div className="doc-actions">
                      <button
                        className="btn capture"
                        onClick={() => openCamera(field)}
                        disabled={processing}
                      >
                        <Camera size={14} />
                        Capture
                      </button>

                      <button
                        className="btn upload"
                        onClick={() => {
                          setActiveField(field);
                          fileInputRef.current.click();
                        }}
                        disabled={processing}
                      >
                        <Upload size={14} />
                        Upload
                      </button>
                    </div>
                  )}
                </div>

                {field.preview && (
                  <div className="doc-preview">
                    <img src={field.preview} alt={field.label} />
                    <button
                      className="btn recapture"
                      onClick={() => recapture(field)}
                    >
                      <RotateCcw size={14} />
                      Re-capture
                    </button>
                  </div>
                )}

                {field.validation && !field.validation.valid && (
                  <div className="doc-error">
                    {field.validation.issues.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn success"
            onClick={save}
            disabled={!allRequiredUploaded || processing}
          >
            <Save size={16} />
            Save & Continue
          </button>

          <button className="btn secondary" onClick={close}>
            <X size={16} />
            Cancel
          </button>
        </div>

        {/* CAMERA OVERLAY */}
        {cameraOpen && (
          <div className="camera-overlay">
            <div className="camera-modal">
              <video ref={videoRef} autoPlay playsInline muted />

              <div className="camera-actions">
                <button
                  className="btn primary"
                  onClick={capture}
                  disabled={processing}
                >
                  <Aperture size={16} />
                  Capture
                </button>

                <button
                  className="btn secondary"
                  onClick={stopCamera}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FILE INPUT */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && activeField) {
              handleFileUpload(file, activeField);
            }
            e.target.value = "";
          }}
        />

        <canvas ref={canvasRef} hidden />
      </div>
    </div>
  );
};

export default DocumentUpload;
