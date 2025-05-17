import { Modal, List, Avatar, Tag, Button, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useEffect } from "react";
import { noteService } from "../../services/noteService";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const { Option } = Select;

const NoteCollaboratorsModal = ({
  isOpen,
  onClose,
  collaborators = [],
  noteUuid,
  noteOwnerUuid,
}) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [updating, setUpdating] = useState(null); // userUuid being updated
  const [removing, setRemoving] = useState(null); // userUuid being removed
  const [localCollaborators, setLocalCollaborators] = useState(collaborators);

  useEffect(() => {
    setLocalCollaborators(collaborators);
  }, [collaborators]);

  const isOwner = currentUser?.uuid === noteOwnerUuid;

  const handlePermissionChange = async (userUuid, permission) => {
    // Optimistically update UI
    const prevCollaborators = [...localCollaborators];
    setLocalCollaborators((prev) =>
      prev.map((c) =>
        c.uuid === userUuid ? { ...c, pivot: { ...c.pivot, permission } } : c
      )
    );
    try {
      setUpdating(userUuid);
      await noteService.updateCollaboratorPermission(
        noteUuid,
        userUuid,
        permission
      );
      toast.success("Permission updated");
    } catch (error) {
      // Revert on error
      setLocalCollaborators(prevCollaborators);
      toast.error(
        error.response?.data?.message || "Failed to update permission"
      );
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (userUuid) => {
    try {
      setRemoving(userUuid);
      await noteService.removeCollaborator(noteUuid, userUuid);
      toast.success("Collaborator removed");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove collaborator"
      );
    } finally {
      setRemoving(null);
    }
  };

  const handleLeave = async (userUuid) => {
    try {
      setRemoving(userUuid);
      await noteService.removeCollaborator(noteUuid, userUuid);
      toast.success("You have left the collaboration");
      onClose?.();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to leave collaboration"
      );
    } finally {
      setRemoving(null);
    }
  };

  const getPermissionColor = (permission) => {
    switch (permission) {
      case "read":
        return "blue";
      case "edit":
        return "green";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "success";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Modal
      title="Collaborators"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className={theme === "dark" ? "dark-modal" : ""}
    >
      <List
        dataSource={localCollaborators}
        renderItem={(collaborator) => {
          const isSelf = currentUser?.uuid === collaborator.uuid;
          return (
            <List.Item
              className={`p-4 border-b rounded-lg ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-700"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3 w-full p-2 ">
                <Avatar
                  src={collaborator.avatar}
                  icon={<UserOutlined />}
                  className="bg-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium ${
                      theme === "dark" ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {collaborator.name}
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {collaborator.email}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Tag
                      color={getPermissionColor(collaborator.pivot.permission)}
                    >
                      {collaborator.pivot.permission === "read"
                        ? "Read Only"
                        : "Can Edit"}
                    </Tag>
                    <Tag color={getStatusColor(collaborator.pivot.status)}>
                      {collaborator.pivot.status.charAt(0).toUpperCase() +
                        collaborator.pivot.status.slice(1)}
                    </Tag>
                  </div>
                </div>
                {/* Controls for permission and remove/leave */}
                <div className="flex items-center gap-2">
                  {isOwner ? (
                    // Owner can change permission and remove others
                    <>
                      <Select
                        value={collaborator.pivot.permission}
                        disabled={
                          updating === collaborator.uuid ||
                          removing === collaborator.uuid ||
                          isSelf // owner cannot change their own permission
                        }
                        onChange={(value) =>
                          handlePermissionChange(collaborator.uuid, value)
                        }
                      >
                        <Option value="read">Read Only</Option>
                        <Option value="edit">Can Edit</Option>
                      </Select>
                      {!isSelf && (
                        <Button
                          danger
                          size="small"
                          loading={removing === collaborator.uuid}
                          onClick={() => handleRemove(collaborator.uuid)}
                        >
                          Remove
                        </Button>
                      )}
                    </>
                  ) : isSelf ? (
                    // Collaborator can only leave
                    <Button
                      danger
                      size="small"
                      loading={removing === collaborator.uuid}
                      onClick={() => handleLeave(collaborator.uuid)}
                    >
                      Leave
                    </Button>
                  ) : null}
                </div>
              </div>
            </List.Item>
          );
        }}
        locale={{
          emptyText: (
            <div
              className={`text-center py-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No collaborators
            </div>
          ),
        }}
      />
    </Modal>
  );
};

export default NoteCollaboratorsModal;
