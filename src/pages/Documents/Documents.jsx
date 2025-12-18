import "./Documents.css";

const Documents = () => {
  const ocrData = {
    name: "Amit Sharma",
    dob: "12-08-1996",
    id: "XXXX-XXXX-4321"
  };

  return (
    <div className="documents">
      <h2>OCR Preview</h2>

      <pre>{JSON.stringify(ocrData, null, 2)}</pre>
      <button>Confirm & Save</button>
    </div>
  );
};

export default Documents;
