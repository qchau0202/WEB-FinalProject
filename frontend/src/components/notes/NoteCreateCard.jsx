import { useState } from "react";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";
import { noteService } from "../../services";

const NoteCreateCard = ({ addNote, viewMode }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const response = await noteService.createNote({
        title: title.trim(),
        content: content.trim(),
        is_public: false,
        is_locked: false,
      });
      const newNote = {
        ...response.note,
        createdAt: response.note.created_at,
        updatedAt: response.note.updated_at
      };
      addNote(newNote);
      setTitle("");
      setContent("");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setLoading(false);
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
        className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all w-full ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600"
            : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
        }`}
        style={{ minHeight: viewMode === "grid" ? "220px" : "180px" }}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className={`rounded-full p-2 ${
              theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200"
            }`}
          >
            <PlusOutlined className="text-2xl" />
          </div>
          <span
            className={`font-medium text-base ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Create New Note
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg shadow-sm border p-5 flex flex-col gap-3 w-full ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-100"
      }`}
      style={{ minHeight: viewMode === "grid" ? "220px" : "180px" }}
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        size="large"
        className={
          theme === "dark" ? "bg-gray-900 border-gray-700 text-gray-100" : ""
        }
      />
      <Input.TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here..."
        rows={viewMode === "grid" ? 3 : 4}
        size="large"
        className={
          theme === "dark" ? "bg-gray-900 border-gray-700 text-gray-100" : ""
        }
      />
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleCancel}
          danger
          className={theme === "dark" ? "text-gray-300" : ""}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleCreateNote}
          disabled={!title.trim() || !content.trim() || loading}
          loading={loading}
          className={theme === "dark" ? "bg-blue-600 hover:bg-blue-500" : ""}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default NoteCreateCard;
