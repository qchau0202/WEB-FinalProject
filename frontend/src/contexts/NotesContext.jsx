// import React, { createContext, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const NotesContext = createContext();

// export const NoteProvider = ({
//   note,
//   onUpdate,
//   onDelete,
//   viewMode,
//   isDetailView,
//   children,
// }) => {
//   const [title, setTitle] = useState(note.title);
//   const [content, setContent] = useState(note.content);
//   const [labels, setLabels] = useState(note.labels || []);
//   const [files, setFiles] = useState(note.files || []);
//   const [confirmDelete, setConfirmDelete] = useState(false);
//   const [showLockModal, setShowLockModal] = useState(false);
//   const navigate = useNavigate();

//   const handleAddLabel = (newLabel) => {
//     if (labels.some((label) => label.name === newLabel.name)) {
//       console.log("Label already added to this note");
//       return;
//     }
//     const updatedLabels = [...labels, newLabel];
//     setLabels(updatedLabels);
//     onUpdate({
//       ...note,
//       labels: updatedLabels,
//       updatedAt: new Date().toISOString(),
//     });
//   };

//   const handlePin = () => {
//     const updatedNote = {
//       ...note,
//       isPinned: !note.isPinned,
//       pinnedAt: !note.isPinned ? new Date().toISOString() : null,
//     };
//     onUpdate(updatedNote);
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
//     setFiles([...files, ...newFiles]);
//     onUpdate({
//       ...note,
//       files: [...files, ...newFiles],
//       updatedAt: new Date().toISOString(),
//     });
//   };

//   const handleInput = (newTitle, newContent) => {
//     const updatedNote = {
//       ...note,
//       title: newTitle,
//       content: newContent,
//       updatedAt: new Date().toISOString(),
//     };
//     onUpdate(updatedNote);
//   };

//   const handleDelete = () => {
//     onDelete(note.id);
//     setConfirmDelete(false);
//     if (isDetailView) {
//       navigate("/");
//     }
//   };

//   const handleFileUpload = (file) => {
//     if (file && file.size <= 5 * 1024 * 1024) {
//       const newFile = { name: file.name, size: file.size };
//       setFiles([...files, newFile]);
//       onUpdate({
//         ...note,
//         files: [...files, newFile],
//         updatedAt: new Date().toISOString(),
//       });
//     }
//   };

//   const handleLockConfirm = (password) => {
//     // Get all notes from localStorage
//     const allNotes = JSON.parse(localStorage.getItem("notes")) || [];

//     // Check if password is already used by another note
//     if (
//       password &&
//       allNotes.some(
//         (n) =>
//           n.id !== note.id &&
//           n.lockStatus?.isLocked &&
//           n.lockStatus?.password === password
//       )
//     ) {
//       toast.error("This password is already used by another note");
//       return;
//     }

//     const updatedNote = {
//       ...note,
//       lockStatus: {
//         isLocked: !note.lockStatus?.isLocked,
//         password: !note.lockStatus?.isLocked ? password : null,
//       },
//     };

//     if (!note.lockStatus?.isLocked) {
//       toast.success("Note locked successfully");
//     } else {
//       toast.success("Note unlocked successfully");
//     }

//     onUpdate(updatedNote);
//     setShowLockModal(false);
//   };

//   const value = {
//     note,
//     title,
//     setTitle,
//     content,
//     setContent,
//     labels,
//     files,
//     confirmDelete,
//     setConfirmDelete,
//     isDetailView,
//     viewMode,
//     navigate,
//     handleAddLabel,
//     handlePin,
//     handleDrop,
//     handleInput,
//     handleDelete,
//     handleFileUpload,
//     handleLockConfirm,
//     showLockModal,
//     setShowLockModal,
//   };

//   return (
//     <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
//   );
// };

// export const useNote = () => useContext(NotesContext);

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