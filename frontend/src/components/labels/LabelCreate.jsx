import { Input, Modal } from "antd";
import CustomColorPicker from "../ui/CustomColorPicker";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";

const LabelCreate = ({
  isNewLabelModalVisible,
  setIsNewLabelModalVisible,
  addNewLabel,
}) => {
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#fadb14");
  const { theme } = useTheme();

  const handleCreateLabel = () => {
    if (!newLabelName.trim()) {
      toast.error("Label name cannot be empty");
      return;
    }

    const newLabel = {
      name: newLabelName.trim(),
      color: newLabelColor,
    };

    addNewLabel(newLabel);
    toast.success("Label created successfully");
    setIsNewLabelModalVisible(false);
    setNewLabelName("");
    setNewLabelColor("#fadb14");
  };

  return (
    <>
      <Modal
        title={
          <span
            className={theme === "dark" ? "text-gray-100" : "text-gray-800"}
          >
            Create New Label
          </span>
        }
        open={isNewLabelModalVisible}
        onOk={handleCreateLabel}
        onCancel={() => {
          setIsNewLabelModalVisible(false);
          setNewLabelName("");
          setNewLabelColor("#fadb14");
        }}
        okText="Create"
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
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
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
                value={newLabelColor}
                onChange={(color) => setNewLabelColor(color)}
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LabelCreate;
