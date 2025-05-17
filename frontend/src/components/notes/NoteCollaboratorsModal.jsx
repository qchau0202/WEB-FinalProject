import { Modal, Avatar, Select, Button } from "antd";
import { useState } from "react";
import { mockCollaborators } from "../../mock-data/collaborators";

const NoteCollaboratorsModal = ({ open, onClose }) => {
  const [collaborators, setCollaborators] = useState(mockCollaborators);

  const handlePermissionChange = (uuid, permission) => {
    setCollaborators((prev) =>
      prev.map((c) => (c.uuid === uuid ? { ...c, permission } : c))
    );
  };

  const handleRemove = (uuid) => {
    setCollaborators((prev) => prev.filter((c) => c.uuid !== uuid));
  };

  return (
    <Modal open={open} onCancel={onClose} title="Collaborators" footer={null}>
      {collaborators.map((collab) => (
        <div key={collab.uuid} className="flex items-center gap-3 mb-3">
          <Avatar src={collab.avatarUrl} />
          <div className="flex-1">
            <div className="font-medium">{collab.name}</div>
            <div className="text-xs text-gray-500">{collab.email}</div>
          </div>
          <Select
            value={collab.permission}
            onChange={(val) => handlePermissionChange(collab.uuid, val)}
            style={{ width: 90 }}
            options={[
              { value: "read", label: "Read" },
              { value: "edit", label: "Edit" },
            ]}
          />
          <Button danger onClick={() => handleRemove(collab.uuid)}>
            Remove
          </Button>
        </div>
      ))}
    </Modal>
  );
};
export default NoteCollaboratorsModal;
