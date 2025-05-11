import { Modal, Input } from "antd";
import CustomColorPicker from "../ui/CustomColorPicker";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const LabelEdit = ({
  isEditLabelModalVisible,
  setIsEditLabelModalVisible,
  editingLabel,
  editLabel,
  selectedLabel,
  setSelectedLabel,
}) => {
  const [editLabelName, setEditLabelName] = useState("");
  const [editLabelColor, setEditLabelColor] = useState("#fadb14");

  useEffect(() => {
    if (editingLabel) {
      setEditLabelName(editingLabel.name);
      setEditLabelColor(editingLabel.color);
    }
  }, [editingLabel]);

  const handleEditLabel = () => {
    if (!editLabelName.trim()) {
      toast.error("Label name cannot be empty");
      return;
    }

    editLabel(editingLabel.name, {
      name: editLabelName.trim(),
      color: editLabelColor,
    });
    toast.success("Label updated successfully");
    setIsEditLabelModalVisible(false);
    setEditLabelName("");
    setEditLabelColor("#fadb14");
    if (selectedLabel === editingLabel.name) {
      setSelectedLabel(editLabelName.trim());
    }
  };

  return (
    <>
      <Modal
        title="Edit Label"
        open={isEditLabelModalVisible}
        onOk={handleEditLabel}
        onCancel={() => {
          setIsEditLabelModalVisible(false);
          setEditLabelName("");
          setEditLabelColor("#fadb14");
        }}
        okText="Save"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label Name
            </label>
            <Input
              value={editLabelName}
              onChange={(e) => setEditLabelName(e.target.value)}
              placeholder="Enter label name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <CustomColorPicker
                value={editLabelColor}
                onChange={(color) => setEditLabelColor(color)}
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
