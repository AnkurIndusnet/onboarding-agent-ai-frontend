import { createContext, useContext, useState } from "react";

const ChecklistContext = createContext();

export const ChecklistProvider = ({ children }) => {
  const [checklist, setChecklist] = useState([]);

  return (
    <ChecklistContext.Provider value={{ checklist, setChecklist }}>
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklist = () => useContext(ChecklistContext);
