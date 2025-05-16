import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { noteService } from "../services";
import { attachmentService } from "../services/attachmentService";
import toast from "react-hot-toast";

const NotesContext = createContext();

export const NoteProvider = ({
  note,
  onUpdate,
  onDelete,
  viewMode,
  isDetailView,
  children,
  onLockStateChange,
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [labels, setLabels] = useState(note.labels || []);
  const [files, setFiles] = useState(note.files || []);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockAction, setLockAction] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const navigate = useNavigate();
  const debounceRef = useRef();

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setLabels(note.labels || []);
    setFiles(note.files || []);
  }, [note]);

  const handleAddLabel = async (label) => {
    try {
      // Always map to IDs, whether note.labels are objects or numbers
      const currentLabelIds = note.labels
        ? note.labels.map((l) => (typeof l === "object" ? l.id : l))
        : [];
      const newLabelIds = [...currentLabelIds, label.id];
      const uniqueLabelIds = Array.from(new Set(newLabelIds));
      const response = await noteService.updateNote(note.uuid, {
        labels: uniqueLabelIds,
        title: note.title,
        content: note.content,
      });
      onUpdate(note.uuid, response.note);
    } catch (error) {
      console.error("Failed to add label:", error, error?.response?.data);
    }
  };

  const handleRemoveLabel = async (label) => {
    try {
      // Always map to IDs, whether note.labels are objects or numbers
      const currentLabelIds = note.labels
        ? note.labels.map((l) => (typeof l === "object" ? l.id : l))
        : [];
      const newLabelIds = currentLabelIds.filter((id) => id !== label.id);
      const response = await noteService.updateNote(note.uuid, {
        labels: newLabelIds,
        title: note.title,
        content: note.content,
      });
      onUpdate(note.uuid, response.note);
    } catch (error) {
      console.error("Failed to remove label:", error, error?.response?.data);
    }
  };

  const handlePin = () => {
    onUpdate(note.uuid, {
      is_pinned: !note.is_pinned,
      pinned_at: !note.is_pinned ? new Date().toISOString() : null,
    });
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
    onUpdate({
      ...note,
      files: [...files, ...newFiles],
      updatedAt: new Date().toISOString(),
    });
  };

  const handleInput = (newTitle, newContent) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const updatedNote = {
        title: newTitle,
        content: newContent,
        updated_at: new Date().toISOString(),
      };
      onUpdate(note.uuid, updatedNote);
    }, 500);
  };

  const handleDelete = async () => {
    try {
      await noteService.deleteNote(note.uuid);
      onDelete(note.uuid);
      setConfirmDelete(false);
      if (isDetailView) {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || !note?.uuid) return;
    try {
      await attachmentService.uploadAttachment(note.uuid, file);
      toast.success("File uploaded!");
      onUpdate(note.uuid, { _isSaving: true });
      await noteService.updateNote(note.uuid, {});
      onUpdate(note.uuid, { _isSaving: false });
      await refreshAttachments();
    } catch {
      toast.error("Failed to upload file");
      onUpdate(note.uuid, { _isSaving: false });
    }
  };

  const refreshAttachments = async () => {
    if (!note?.uuid) return;
    try {
      const files = await attachmentService.getAttachments(note.uuid);
      setAttachments(files);
    } catch {
      setAttachments([]);
    }
  };

  useEffect(() => {
    refreshAttachments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.uuid]);

  const value = {
    note,
    title,
    setTitle,
    content,
    setContent,
    labels,
    files,
    confirmDelete,
    setConfirmDelete,
    isDetailView,
    viewMode,
    navigate,
    handleAddLabel,
    handleRemoveLabel,
    handlePin,
    handleDrop,
    handleInput,
    handleDelete,
    handleFileUpload,
    attachments,
    refreshAttachments,
    showLockModal,
    setShowLockModal,
    lockAction,
    setLockAction,
    onLockStateChange,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
};

export const useNote = () => useContext(NotesContext);
