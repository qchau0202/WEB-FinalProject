// import { createContext, useContext, useState, useEffect } from "react";
// import labels from "../mock-data/labels";

// const LabelContext = createContext();

// export const LabelProvider = ({ children }) => {
//   const [selectedLabel, setSelectedLabel] = useState(null);
//   const [labelsCollapsed, setLabelsCollapsed] = useState(false);
//   const [availableLabels, setAvailableLabels] = useState(() => {
//     const savedLabels = localStorage.getItem("labels");
//     return savedLabels ? JSON.parse(savedLabels) : labels;
//   });

//   // Save labels to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("labels", JSON.stringify(availableLabels));
//   }, [availableLabels]);

//   const handleLabelSelect = (labelName) => {
//     setSelectedLabel(labelName);
//   };

//   const toggleLabelsCollapsed = () => {
//     setLabelsCollapsed(!labelsCollapsed);
//   };

//   const addNewLabel = (newLabel) => {
//     setAvailableLabels((prevLabels) => [...prevLabels, newLabel]);
//   };

//   return (
//     <LabelContext.Provider
//       value={{
//         selectedLabel,
//         setSelectedLabel: handleLabelSelect,
//         labelsCollapsed,
//         toggleLabelsCollapsed,
//         availableLabels,
//         addNewLabel,
//       }}
//     >
//       {children}
//     </LabelContext.Provider>
//   );
// };

// export const useLabel = () => useContext(LabelContext);

import { createContext, useContext, useState, useEffect } from "react";
import labels from "../mock-data/labels";

const LabelContext = createContext();

export const LabelProvider = ({ children }) => {
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [labelsCollapsed, setLabelsCollapsed] = useState(false);
  const [availableLabels, setAvailableLabels] = useState(() => {
    const savedLabels = localStorage.getItem("labels");
    return savedLabels ? JSON.parse(savedLabels) : labels;
  });

  // Save labels to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("labels", JSON.stringify(availableLabels));
  }, [availableLabels]);

  const handleLabelSelect = (labelName) => {
    setSelectedLabel(labelName);
  };

  const toggleLabelsCollapsed = () => {
    setLabelsCollapsed(!labelsCollapsed);
  };

  const addNewLabel = (newLabel) => {
    setAvailableLabels((prevLabels) => [...prevLabels, newLabel]);
  };

  const editLabel = (oldName, updatedLabel) => {
    setAvailableLabels((prevLabels) =>
      prevLabels.map((label) =>
        label.name === oldName ? { ...label, ...updatedLabel } : label
      )
    );
  };

  const deleteLabel = (labelName) => {
    setAvailableLabels((prevLabels) =>
      prevLabels.filter((label) => label.name !== labelName)
    );
  };

  return (
    <LabelContext.Provider
      value={{
        selectedLabel,
        setSelectedLabel: handleLabelSelect,
        labelsCollapsed,
        toggleLabelsCollapsed,
        availableLabels,
        addNewLabel,
        editLabel,
        deleteLabel,
      }}
    >
      {children}
    </LabelContext.Provider>
  );
};

export const useLabel = () => useContext(LabelContext);
