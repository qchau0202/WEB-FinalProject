import { Input, Modal } from "antd";
import CustomColorPicker from "../ui/CustomColorPicker";
import { useState } from "react";
import toast from "react-hot-toast";

const LabelCreate = ({
  isNewLabelModalVisible,
  setIsNewLabelModalVisible,
  addNewLabel,
}) => {
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#fadb14");

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
        title="Create New Label"
        open={isNewLabelModalVisible}
        onOk={handleCreateLabel}
        onCancel={() => {
          setIsNewLabelModalVisible(false);
          setNewLabelName("");
          setNewLabelColor("#fadb14");
        }}
        okText="Create"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label Name
            </label>
            <Input
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              placeholder="Enter label name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
