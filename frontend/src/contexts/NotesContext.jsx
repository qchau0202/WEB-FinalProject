import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const NotesContext = createContext();

export const NoteProvider = ({
  note,
  onUpdate,
  onDelete,
  viewMode,
  isDetailView,
  children,
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [labels, setLabels] = useState(note.labels || []);
  const [files, setFiles] = useState(note.files || []);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const navigate = useNavigate();

  const handleAddLabel = (newLabel) => {
    if (labels.some((label) => label.name === newLabel.name)) {
      console.log("Label already added to this note");
      return;
    }
    const updatedLabels = [...labels, newLabel];
    setLabels(updatedLabels);
    onUpdate({
      ...note,
      labels: updatedLabels,
      updatedAt: new Date().toISOString(),
    });
  };

  const handlePin = () => {
    const updatedNote = {
      ...note,
      isPinned: !note.isPinned,
      pinnedAt: !note.isPinned ? new Date().toISOString() : null,
    };
    onUpdate(updatedNote);
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
    const updatedNote = {
      ...note,
      title: newTitle,
      content: newContent,
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updatedNote);
  };

  const handleDelete = () => {
    onDelete(note.id);
    setConfirmDelete(false);
    if (isDetailView) {
      navigate("/");
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.size <= 5 * 1024 * 1024) {
      const newFile = { name: file.name, size: file.size };
      setFiles([...files, newFile]);
      onUpdate({
        ...note,
        files: [...files, newFile],
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleLockConfirm = (
    password,
    lockFeatureEnabled,
    isLocked = false
  ) => {
    const updatedNote = {
      ...note,
      lockStatus: {
        isLocked,
        password: lockFeatureEnabled ? password : null,
      },
      lockFeatureEnabled,
    };

    onUpdate(updatedNote);
    if (lockFeatureEnabled && !isLocked && !password) {
      toast.success("Lock feature enabled");
    } else if (isLocked) {
      toast.success("Note locked successfully");
    }
  };

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
    handlePin,
    handleDrop,
    handleInput,
    handleDelete,
    handleFileUpload,
    handleLockConfirm,
    showLockModal,
    setShowLockModal,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
};

export const useNote = () => useContext(NotesContext);
// import React, { createContext, useContext, useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { noteService } from "../services/api";

// const NotesContext = createContext();

// export const useNotes = () => {
//   const context = useContext(NotesContext);
//   if (!context) {
//     throw new Error("useNotes must be used within a NotesProvider");
//   }
//   return context;
// };

// export const NotesProvider = ({ children, navigate }) => {
//   const [notes, setNotes] = useState([]);
//   const [sharedNotes, setSharedNotes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentNote, setCurrentNote] = useState(null);
//   const [showLockModal, setShowLockModal] = useState(false);
//   const [isLocking, setIsLocking] = useState(false);

//   const fetchNotes = async () => {
//     try {
//       setLoading(true);
//       const response = await noteService.getAllNotes();
//       setNotes(response.own_notes || []);
//       setSharedNotes(response.shared_notes || []);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       toast.error("Failed to fetch notes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createNote = async (noteData) => {
//     try {
//       const response = await noteService.createNote(noteData);
//       setNotes((prevNotes) => [...prevNotes, response.note]);
//       toast.success("Note created successfully");
//       return response.note;
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create note");
//       throw err;
//     }
//   };

//   const updateNote = async (uuid, noteData) => {
//     try {
//       const response = await noteService.updateNote(uuid, noteData);
//       setNotes((prevNotes) =>
//         prevNotes.map((note) => (note.uuid === uuid ? response.note : note))
//       );
//       if (currentNote?.uuid === uuid) {
//         setCurrentNote(response.note);
//       }
//       toast.success("Note updated successfully");
//       return response.note;
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update note");
//       throw err;
//     }
//   };

//   const deleteNote = async (uuid) => {
//     try {
//       await noteService.deleteNote(uuid);
//       setNotes((prevNotes) => prevNotes.filter((note) => note.uuid !== uuid));
//       if (currentNote?.uuid === uuid) {
//         setCurrentNote(null);
//       }
//       toast.success("Note deleted successfully");
//       if (navigate) {
//         navigate("/");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete note");
//       throw err;
//     }
//   };

//   const addCollaborator = async (noteUuid, collaboratorData) => {
//     try {
//       const response = await noteService.addCollaborator(
//         noteUuid,
//         collaboratorData
//       );
//       setNotes((prevNotes) =>
//         prevNotes.map((note) =>
//           note.uuid === noteUuid
//             ? {
//                 ...note,
//                 collaborators: [...note.collaborators, response.collaborator],
//               }
//             : note
//         )
//       );
//       toast.success("Collaborator added successfully");
//       return response.collaborator;
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add collaborator");
//       throw err;
//     }
//   };

//   const removeCollaborator = async (noteUuid, userId) => {
//     try {
//       await noteService.removeCollaborator(noteUuid, userId);
//       setNotes((prevNotes) =>
//         prevNotes.map((note) =>
//           note.uuid === noteUuid
//             ? {
//                 ...note,
//                 collaborators: note.collaborators.filter(
//                   (c) => c.user_uuid !== userId
//                 ),
//               }
//             : note
//         )
//       );
//       toast.success("Collaborator removed successfully");
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Failed to remove collaborator"
//       );
//       throw err;
//     }
//   };

//   const uploadAttachment = async (noteUuid, file) => {
//     try {
//       const response = await noteService.uploadAttachment(noteUuid, file);
//       setNotes((prevNotes) =>
//         prevNotes.map((note) =>
//           note.uuid === noteUuid
//             ? {
//                 ...note,
//                 attachments: [...note.attachments, response.attachment],
//               }
//             : note
//         )
//       );
//       toast.success("Attachment uploaded successfully");
//       return response.attachment;
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to upload attachment");
//       throw err;
//     }
//   };

//   const deleteAttachment = async (noteUuid, attachmentId) => {
//     try {
//       await noteService.deleteAttachment(noteUuid, attachmentId);
//       setNotes((prevNotes) =>
//         prevNotes.map((note) =>
//           note.uuid === noteUuid
//             ? {
//                 ...note,
//                 attachments: note.attachments.filter(
//                   (a) => a.id !== attachmentId
//                 ),
//               }
//             : note
//         )
//       );
//       toast.success("Attachment deleted successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete attachment");
//       throw err;
//     }
//   };

//   const handleAddLabel = (newLabel) => {
//     if (currentNote?.labels.some((label) => label.name === newLabel.name)) {
//       console.log("Label already added to this note");
//       return;
//     }
//     const updatedLabels = [...currentNote.labels, newLabel];
//     updateNote(currentNote.uuid, {
//       ...currentNote,
//       labels: updatedLabels,
//       updatedAt: new Date().toISOString(),
//     });
//   };

//   const handlePin = () => {
//     const updatedNote = {
//       ...currentNote,
//       isPinned: !currentNote.isPinned,
//       pinnedAt: !currentNote.isPinned ? new Date().toISOString() : null,
//     };
//     updateNote(currentNote.uuid, updatedNote);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const droppedFiles = Array.from(e.dataTransfer.files);
//     const validFiles = droppedFiles.filter(
//       (file) => file.size <= 5 * 1024 * 1024
//     );
//     const newFiles = validFiles.map((file) => ({
//       name: file.name,
//       size: file.size,
//     }));
//     updateNote(currentNote.uuid, {
//       ...currentNote,
//       files: [...currentNote.files, ...newFiles],
//       updatedAt: new Date().toISOString(),
//     });
//   };

//   const handleInput = (newTitle, newContent) => {
//     const updatedNote = {
//       ...currentNote,
//       title: newTitle,
//       content: newContent,
//       updatedAt: new Date().toISOString(),
//     };
//     updateNote(currentNote.uuid, updatedNote);
//   };

//   const handleLockNote = async (note, password) => {
//     try {
//       setIsLocking(true);
//       const updatedNote = {
//         ...note,
//         lockStatus: {
//           isLocked: true,
//           password: password,
//         },
//         lockFeatureEnabled: true,
//       };
//       await updateNote(note.uuid, updatedNote);
//       toast.success("Note locked successfully");
//     } catch (err) {
//       toast.error("Failed to lock note");
//     } finally {
//       setIsLocking(false);
//       setShowLockModal(false);
//     }
//   };

//   const handleUnlockNote = async (note, password) => {
//     try {
//       setIsLocking(true);
//       const updatedNote = {
//         ...note,
//         lockStatus: {
//           isLocked: false,
//           password: note.lockStatus.password,
//         },
//       };
//       await updateNote(note.uuid, updatedNote);
//       toast.success("Note unlocked successfully");
//     } catch (err) {
//       toast.error("Failed to unlock note");
//     } finally {
//       setIsLocking(false);
//     }
//   };

//   const handleEnableLockFeature = async (note, password) => {
//     try {
//       setIsLocking(true);
//       const updatedNote = {
//         ...note,
//         lockFeatureEnabled: true,
//         lockStatus: {
//           isLocked: false,
//           password: password,
//         },
//       };
//       await updateNote(note.uuid, updatedNote);
//       toast.success("Lock feature enabled");
//     } catch (err) {
//       toast.error("Failed to enable lock feature");
//     } finally {
//       setIsLocking(false);
//       setShowLockModal(false);
//     }
//   };

//   const handleDisableLockFeature = async (note, password) => {
//     try {
//       setIsLocking(true);
//       const updatedNote = {
//         ...note,
//         lockFeatureEnabled: false,
//         lockStatus: null,
//       };
//       await updateNote(note.uuid, updatedNote);
//       toast.success("Lock feature disabled");
//     } catch (err) {
//       toast.error("Failed to disable lock feature");
//     } finally {
//       setIsLocking(false);
//       setShowLockModal(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const value = {
//     notes,
//     sharedNotes,
//     loading,
//     error,
//     currentNote,
//     setCurrentNote,
//     fetchNotes,
//     createNote,
//     updateNote,
//     deleteNote,
//     addCollaborator,
//     removeCollaborator,
//     uploadAttachment,
//     deleteAttachment,
//     handleAddLabel,
//     handlePin,
//     handleDrop,
//     handleInput,
//     showLockModal,
//     setShowLockModal,
//     isLocking,
//     handleLockNote,
//     handleUnlockNote,
//     handleEnableLockFeature,
//     handleDisableLockFeature,
//   };

//   return (
//     <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
//   );
// };
