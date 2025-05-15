import { Input, Modal } from "antd";
import CustomColorPicker from "../ui/CustomColorPicker";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";

const LabelEdit = ({
  isEditLabelModalVisible,
  setIsEditLabelModalVisible,
  editingLabel,
  editLabel,
  selectedLabel,
  setSelectedLabel,
}) => {
  const [editedLabelName, setEditedLabelName] = useState("");
  const [editedLabelColor, setEditedLabelColor] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    if (editingLabel) {
      setEditedLabelName(editingLabel.name);
      setEditedLabelColor(editingLabel.color);
    }
  }, [editingLabel]);

  const handleEditLabel = () => {
    if (!editedLabelName.trim()) {
      toast.error("Label name cannot be empty");
      return;
    }

    const updatedLabel = {
      name: editedLabelName.trim(),
      color: editedLabelColor,
    };

    editLabel(editingLabel.name, updatedLabel);
    if (selectedLabel === editingLabel.name) {
      setSelectedLabel(updatedLabel.name);
    }
    toast.success("Label updated successfully");
    setIsEditLabelModalVisible(false);
  };

  return (
    <>
      <Modal
        title={
          <span
            className={theme === "dark" ? "text-gray-100" : "text-gray-800"}
          >
            Edit Label
          </span>
        }
        open={isEditLabelModalVisible}
        onOk={handleEditLabel}
        onCancel={() => {
          setIsEditLabelModalVisible(false);
          setEditedLabelName("");
          setEditedLabelColor("");
        }}
        okText="Save"
        cancelText="Cancel"
        className={theme === "dark" ? "dark-modal" : ""}
      >
        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Label Name
            </label>
            <Input
              value={editedLabelName}
              onChange={(e) => setEditedLabelName(e.target.value)}
              placeholder="Enter label name"
              className={
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : ""
              }
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Color
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <CustomColorPicker
                value={editedLabelColor}
                onChange={(color) => setEditedLabelColor(color)}
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LabelEdit;
