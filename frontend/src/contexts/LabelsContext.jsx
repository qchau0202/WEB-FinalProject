import { createContext, useContext, useState, useEffect } from "react";
import { labelService } from "../services/labelService";
import { noteService } from "../services";

const LabelContext = createContext();

export const LabelProvider = ({ children }) => {
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [labelsCollapsed, setLabelsCollapsed] = useState(false);
  const [availableLabels, setAvailableLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch labels from backend on mount
  useEffect(() => {
    const fetchLabels = async () => {
      setLoading(true);
      try {
        const labels = await labelService.getAllLabels();
        setAvailableLabels(labels);
      } catch {
        setAvailableLabels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLabels();
  }, []);

  const handleLabelSelect = (labelName) => {
    setSelectedLabel(labelName);
  };

  const toggleLabelsCollapsed = () => {
    setLabelsCollapsed(!labelsCollapsed);
  };

  const addNewLabel = async (newLabel) => {
    try {
      const response = await labelService.createLabel(newLabel);
      setAvailableLabels((prev) => [...prev, response.label]);
    } catch {
      // handle error (toast, etc.)
    }
  };

  const editLabel = async (oldName, updatedLabel) => {
    try {
      const label = availableLabels.find((l) => l.name === oldName);
      if (!label) return;
      const response = await labelService.updateLabel(label.id, updatedLabel);

      // Update available labels
      setAvailableLabels((prev) =>
        prev.map((l) => (l.id === label.id ? response.label : l))
      );

      // Update notes that use this label
      try {
        const notesResponse = await noteService.getAllNotes();
        const allNotes = [
          ...notesResponse.own_notes,
          ...notesResponse.shared_notes,
        ];
        const updatedNotes = allNotes.map((note) => {
          if (note.labels) {
            const updatedLabels = note.labels.map((l) => {
              if (l.id === label.id) {
                return response.label;
              }
              return l;
            });
            return { ...note, labels: updatedLabels };
          }
          return note;
        });
        localStorage.setItem(
          "notelit-notes-cache",
          JSON.stringify(updatedNotes)
        );
      } catch (error) {
        console.error("Failed to update notes with new label:", error);
      }
    } catch {
      // handle error (toast, etc.)
    }
  };

  const deleteLabel = async (labelName) => {
    try {
      const label = availableLabels.find((l) => l.name === labelName);
      if (!label) return;
      await labelService.deleteLabel(label.id);
      setAvailableLabels((prev) => prev.filter((l) => l.id !== label.id));
    } catch {
      // handle error (toast, etc.)
    }
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
        loading,
      }}
    >
      {children}
    </LabelContext.Provider>
  );
};

export const useLabel = () => useContext(LabelContext);
