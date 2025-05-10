import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import NoteHeader from "./NoteHeader";
import NoteContent from "./NoteContent";
import NoteAttachments from "./NoteAttachments";
import NoteDeleteModal from "./NoteDeleteModal";

const Note = ({ note, onUpdate, onDelete, viewMode, isDetailView = false }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags);
  const [files, setFiles] = useState(note.files);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  const handleAddTag = (newTag) => {
    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    onUpdate({ ...note, tags: updatedTags });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(
      (file) => file.size <= 5 * 1024 * 1024
    );
    const newFiles = validFiles.map((file) => ({
      name: file.name,
      size: file.size,
    }));
    setFiles([...files, ...newFiles]);
    onUpdate({ ...note, files: [...files, ...newFiles] });
  };

  const handleInput = (newTitle, newContent) => {
    const updatedNote = {
      ...note,
      title: newTitle,
      content: newContent,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    onUpdate(updatedNote);
  };

  const handleDelete = () => {
    onDelete(note.id);
    setConfirmDelete(false);
    message.success("Note deleted successfully");
    if (isDetailView) {
      navigate("/");
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.size <= 5 * 1024 * 1024) {
      setFiles([...files, { name: file.name, size: file.size }]);
      onUpdate({
        ...note,
        files: [...files, { name: file.name, size: file.size }],
      });
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 transition-all ${
        isDetailView
          ? "max-w-5xl mx-auto w-full"
          : viewMode === "grid"
          ? "w-full hover:shadow-md"
          : "w-full hover:shadow-md"
      } flex flex-col relative`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        minHeight: isDetailView
          ? "auto"
          : viewMode === "grid"
          ? "220px"
          : "120px",
        height: isDetailView ? "auto" : "auto",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <NoteHeader
        title={title}
        setTitle={setTitle}
        note={note}
        isDetailView={isDetailView}
        viewMode={viewMode}
        navigate={navigate}
        setConfirmDelete={setConfirmDelete}
        handleInput={handleInput}
        content={content}
      />
      <NoteContent
        content={content}
        setContent={setContent}
        tags={tags}
        onAddTag={handleAddTag}
        isDetailView={isDetailView}
        viewMode={viewMode}
        handleInput={handleInput}
        title={title}
        handleFileUpload={handleFileUpload}
      />
      <NoteAttachments files={files} isDetailView={isDetailView} note={note} />
      <NoteDeleteModal
        confirmDelete={confirmDelete}
        handleDelete={handleDelete}
        setConfirmDelete={setConfirmDelete}
      />
    </div>
  );
};

export default Note;
