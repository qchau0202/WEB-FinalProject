import { useState } from "react";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const NoteCreateCard = ({ addNote, viewMode }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateNote = () => {
    if (title.trim() || content.trim()) {
      addNote({
        title: title.trim(),
        content: content.trim(),
      });
      setTitle("");
      setContent("");
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div
        className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-100 hover:border-gray-300 w-full"
        style={{ minHeight: viewMode === "grid" ? "220px" : "180px" }}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="bg-gray-200 rounded-full p-2">
            <PlusOutlined className="text-blue-500 text-xl" />
          </div>
          <span className="text-gray-500 font-medium text-base">
            Create New Note
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex flex-col gap-3 w-full"
      style={{ minHeight: viewMode === "grid" ? "220px" : "180px" }}
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        size="large"
      />
      <Input.TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here..."
        rows={viewMode === "grid" ? 3 : 4}
        size="large"
      />
      <div className="flex justify-end gap-2">
        <Button onClick={handleCancel} danger>Cancel</Button>
        <Button
          type="primary"
          onClick={handleCreateNote}
          disabled={!title.trim() && !content.trim()}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default NoteCreateCard;
