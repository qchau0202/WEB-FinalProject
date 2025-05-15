import { Modal } from "antd";
import { useTheme } from "../../contexts/ThemeContext";

const LabelDelete = ({
  isDeleteLabelModalVisible,
  setIsDeleteLabelModalVisible,
  deletingLabelName,
  setDeletingLabelName,
  deleteLabel,
  selectedLabel,
  setSelectedLabel,
}) => {
  const { theme } = useTheme();

  const handleDelete = () => {
    deleteLabel(deletingLabelName);
    if (selectedLabel === deletingLabelName) {
      setSelectedLabel(null);
    }
    setIsDeleteLabelModalVisible(false);
    setDeletingLabelName(null);
  };

  return (
    <Modal
      title={
        <span className={theme === "dark" ? "text-gray-100" : "text-gray-800"}>
          Delete Label
        </span>
      }
      open={isDeleteLabelModalVisible}
      onOk={handleDelete}
      onCancel={() => {
        setIsDeleteLabelModalVisible(false);
        setDeletingLabelName(null);
      }}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
      className={theme === "dark" ? "dark-modal" : ""}
    >
      <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
        Are you sure you want to delete the label "{deletingLabelName}"? <br></br>This
        action cannot be undone.
      </p>
    </Modal>
  );
};

export default LabelDelete;
