import { Modal } from "antd";
import toast from "react-hot-toast";

const LabelDelete = ({ isDeleteLabelModalVisible, setIsDeleteLabelModalVisible, deletingLabelName, setDeletingLabelName, deleteLabel, selectedLabel, setSelectedLabel }) => {
    return (
      <>
        <Modal
          title="Delete Label"
          open={isDeleteLabelModalVisible}
          onOk={() => {
            deleteLabel(deletingLabelName);
            toast.success("Label deleted successfully");
            if (selectedLabel === deletingLabelName) {
              setSelectedLabel(null);
            }
            setIsDeleteLabelModalVisible(false);
            setDeletingLabelName(null);
          }}
          onCancel={() => {
            setIsDeleteLabelModalVisible(false);
            setDeletingLabelName(null);
          }}
          okText="Delete"
          okType="danger"
          cancelText="Cancel"
        >
          <p>
            Are you sure you want to delete the label "{deletingLabelName}"?
          </p>
        </Modal>
      </>
    );
};

export default LabelDelete;


