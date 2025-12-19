import { useState, useRef, useEffect } from "react";
import "./MultiSelectDropdown.css";

const MultiSelectDropdown = ({
  label,
  placeholder,
  options,
  selected,
  setSelected,
  searchable = false
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef();

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggle = (item) => {
    setSelected(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const filtered = searchable
    ? options.filter(o =>
        o.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  return (
    <div className="msd" ref={ref}>
      <label>{label}</label>

      <div className="msd-input" onClick={() => setOpen(!open)}>
        {selected.length
          ? selected.join(", ")
          : placeholder}
        <span className="caret">▾</span>
      </div>

      {open && (
        <div className="msd-panel">
          {searchable && (
            <input
              className="msd-search"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}

          {filtered.map(item => (
            <label key={item} className="msd-option">
              <input
                type="checkbox"
                checked={selected.includes(item)}
                onChange={() => toggle(item)}
              />
              <span>{item}</span>
            </label>
          ))}

          {!filtered.length && (
            <div className="msd-empty">No results</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
