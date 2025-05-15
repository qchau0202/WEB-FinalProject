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
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { labelService } from "../services/api";
// import toast from "react-hot-toast";

// const LabelsContext = createContext();

// export const useLabels = () => {
//   const context = useContext(LabelsContext);
//   if (!context) {
//     throw new Error("useLabels must be used within a LabelsProvider");
//   }
//   return context;
// };

// export const LabelsProvider = ({ children }) => {
//   const [labels, setLabels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchLabels = async () => {
//     try {
//       setLoading(true);
//       const response = await labelService.getAllLabels();
//       setLabels(response);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       toast.error("Failed to fetch labels");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createLabel = async (labelData) => {
//     try {
//       const response = await labelService.createLabel(labelData);
//       setLabels((prevLabels) => [...prevLabels, response.label]);
//       toast.success("Label created successfully");
//       return response.label;
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create label");
//       throw err;
//     }
//   };

//   const updateLabel = async (id, labelData) => {
//     try {
//       const response = await labelService.updateLabel(id, labelData);
//       setLabels((prevLabels) =>
//         prevLabels.map((label) => (label.id === id ? response.label : label))
//       );
//       toast.success("Label updated successfully");
//       return response.label;
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update label");
//       throw err;
//     }
//   };

//   const deleteLabel = async (id) => {
//     try {
//       await labelService.deleteLabel(id);
//       setLabels((prevLabels) => prevLabels.filter((label) => label.id !== id));
//       toast.success("Label deleted successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete label");
//       throw err;
//     }
//   };

//   useEffect(() => {
//     fetchLabels();
//   }, []);

//   const value = {
//     labels,
//     loading,
//     error,
//     fetchLabels,
//     createLabel,
//     updateLabel,
//     deleteLabel,
//   };

//   return (
//     <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>
//   );
// };
