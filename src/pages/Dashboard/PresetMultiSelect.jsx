import "./PresetMultiSelect.css";

const PresetMultiSelect = ({ presets, selected, setSelected }) => {
  const toggle = (item) => {
    setSelected(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="preset-box">
      {presets.map(p => (
        <div
          key={p}
          className={`preset-chip ${selected.includes(p) ? "active" : ""}`}
          onClick={() => toggle(p)}
        >
          {p}
        </div>
      ))}
    </div>
  );
};

export default PresetMultiSelect;
