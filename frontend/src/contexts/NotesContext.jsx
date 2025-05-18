import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { noteService } from "../services";
import { attachmentService } from "../services/attachmentService";
import { useDebouncedCallback } from "../hooks/useDebounce";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import NoteLockModal from "../components/notes/NoteLockModal";
import NoteChangePasswordModal from "../components/notes/NoteChangePasswordModal";

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
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const navigate = useNavigate();
  const saveController = useRef(null);
  const { currentUser } = useAuth();
  let permission = "owner";
  if (currentUser && note.user_id !== currentUser.uuid) {
    // Not the owner, check collaborators
    const collab = (note.collaborators || []).find(
      (c) => c.uuid === currentUser.uuid
    );
    permission = collab?.pivot?.permission || "read";
  }

  // Memoize the note update callback
  const updateNoteCallback = useCallback(
    (newTitle, newContent) => {
      if (newTitle !== note.title || newContent !== note.content) {
        // Cancel previous request
        if (saveController.current) {
          saveController.current.abort();
        }
        saveController.current = new AbortController();
        const updatedNote = {
          title: newTitle,
          content: newContent,
          updated_at: new Date().toISOString(),
        };
        onUpdate(note.uuid, updatedNote, saveController.current.signal);
      }
    },
    [note.title, note.content, note.uuid, onUpdate]
  );

  const debouncedUpdate = useDebouncedCallback(updateNoteCallback, 800);

  // Only update local state if the note content actually changed
  useEffect(() => {
    if (note.title !== title) setTitle(note.title);
    if (note.content !== content) setContent(note.content);
    if (JSON.stringify(note.labels) !== JSON.stringify(labels))
      setLabels(note.labels || []);
    if (JSON.stringify(note.files) !== JSON.stringify(files))
      setFiles(note.files || []);
  }, [note]);

  const handleAddLabel = useCallback(
    async (label) => {
      try {
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
    },
    [note, onUpdate]
  );

  const handleRemoveLabel = useCallback(
    async (label) => {
      try {
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
    },
    [note, onUpdate]
  );

  const handlePin = useCallback(() => {
    onUpdate(note.uuid, {
      is_pinned: !note.is_pinned,
      pinned_at: !note.is_pinned ? new Date().toISOString() : null,
    });
  }, [note, onUpdate]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(
        (file) => file.size <= 5 * 1024 * 1024
      );
      const newFiles = validFiles.map((file) => ({
        name: file.name,
        size: file.size,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
      onUpdate(note.uuid, {
        ...note,
        files: [...files, ...newFiles],
        updated_at: new Date().toISOString(),
      });
    },
    [note, files, onUpdate]
  );

  const handleInput = useCallback(
    (newTitle, newContent) => {
      setTitle(newTitle);
      setContent(newContent);
      debouncedUpdate(newTitle, newContent);
    },
    [debouncedUpdate]
  );

  const handleDelete = useCallback(async () => {
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
  }, [note.uuid, onDelete, isDetailView, navigate]);

  const handleFileUpload = useCallback(
    async (files) => {
      if (!files || !note?.uuid) return;
      const fileArray = Array.isArray(files) ? files : [files];
      try {
        for (const file of fileArray) {
          await attachmentService.uploadAttachment(note.uuid, file);
        }
        toast.success(
          fileArray.length > 1
            ? `Uploaded ${fileArray.length} files!`
            : "File uploaded!"
        );
        onUpdate(note.uuid, { _isSaving: true });
        await noteService.updateNote(note.uuid, {});
        onUpdate(note.uuid, { _isSaving: false });
        await refreshAttachments();
      } catch {
        toast.error("Failed to upload file(s)");
        onUpdate(note.uuid, { _isSaving: false });
      }
    },
    [note, onUpdate]
  );

  const refreshAttachments = useCallback(async () => {
    if (!note?.uuid) return;
    try {
      const files = await attachmentService.getAttachments(note.uuid);
      setAttachments(files);
    } catch {
      setAttachments([]);
    }
  }, [note?.uuid]);

  useEffect(() => {
    if (note?.uuid) {
      refreshAttachments();
    }
  }, [note?.uuid]);

  const value = useMemo(
    () => ({
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
      showChangePasswordModal,
      setShowChangePasswordModal,
      onLockStateChange,
      permission,
    }),
    [
      note,
      title,
      content,
      labels,
      files,
      confirmDelete,
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
      lockAction,
      showChangePasswordModal,
      onLockStateChange,
      permission,
    ]
  );

  return (
    <NotesContext.Provider value={value}>
      {children}
      <NoteLockModal />
      <NoteChangePasswordModal />
    </NotesContext.Provider>
  );
};

export const useNote = () => useContext(NotesContext);
