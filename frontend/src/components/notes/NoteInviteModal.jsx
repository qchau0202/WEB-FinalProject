import { useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useTheme } from "../../contexts/ThemeContext";
import { noteService } from "../../services/noteService";
import { notificationService } from "../../services/notificationService";
import { toast } from "react-hot-toast";

const { Option } = Select;

const NoteInviteModal = ({ isOpen, onClose, noteUuid }) => {
  const { theme } = useTheme();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(Array.isArray(response.data) ? response.data : []);
    } catch {
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await noteService.addCollaborator(noteUuid, {
        email: values.email,
        permission: values.permission,
      });
      await fetchNotifications();
      toast.success("Invitation sent successfully");
      form.resetFields();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send invitation/User does not exist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Invite Collaborator"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className={theme === "dark" ? "dark-modal" : ""}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={theme === "dark" ? "dark-form" : ""}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            placeholder="Enter collaborator's email"
            className={theme === "dark" ? "dark-input" : ""}
          />
        </Form.Item>

        <Form.Item
          name="permission"
          label="Permission"
          rules={[{ required: true, message: "Please select permission" }]}
          initialValue="read"
        >
          <Select className={theme === "dark" ? "dark-select" : ""}>
            <Option value="read">Read Only</Option>
            <Option value="edit">Can Edit</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Send Invitation
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NoteInviteModal;
