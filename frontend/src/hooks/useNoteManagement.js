import { useState, useEffect } from "react";
import { notes as initialNotes } from "../mock-data/notes";

const useNoteManagement = () => {
  // Initialize notes from localStorage, ensuring pinnedAt exists
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    const parsedNotes = savedNotes ? JSON.parse(savedNotes) : initialNotes;
    return parsedNotes.map((note) => ({
      ...note,
      pinnedAt: note.pinnedAt || null,
      lockStatus: note.lockStatus || { isLocked: false, password: null },
    }));
  });
  const [loading] = useState(false);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    console.log("Saving notes to localStorage:", notes); // Debug log
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // const addNote = (note) => {
  //   // Create a minimal note object with only required fields
  //   const newNote = {
  //     id: note.id || Date.now().toString(),
  //     title: note.title || "New Note",
  //     content: note.content || "",
  //     createdAt: new Date().toISOString().split("T")[0], // Only set createdAt
  //     labels: [], // Initialize empty to avoid undefined
  //     files: [], // Initialize empty to avoid undefined
  //     isPinned: false,
  //     pinnedAt: null,
  //     order: notes.length,
  //   };
  //   setNotes((prevNotes) => [newNote, ...prevNotes]);
  // };

  const addNote = (note) => {
    if (!note.title?.trim() && !note.content?.trim()) return; // Skip empty notes
    const newNote = {
      id: note.id || Date.now().toString(),
      title: note.title?.trim() || "New Note",
      content: note.content?.trim() || "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: null,
      labels: [],
      files: [],
      isPinned: false,
      pinnedAt: null,
      order: 0,
      lockStatus: { isLocked: false, password: null },
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  const updateNote = (updatedNote) => {
    console.log("Updating note:", updatedNote); // Debug log
    setNotes((prevNotes) => {
      const newNotes = prevNotes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      );
      console.log("New notes state:", newNotes); // Debug log
      return newNotes;
    });
  };

  const deleteNote = (noteId) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  const togglePinNote = (noteId) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              isPinned: !note.isPinned,
              pinnedAt: !note.isPinned ? new Date().toISOString() : null,
            }
          : note
      )
    );
  };

  const lockNote = (noteId, password) => {
    console.log("Locking note:", noteId, "with password:", password); // Debug log
    setNotes((prevNotes) => {
      const newNotes = prevNotes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              lockStatus: {
                isLocked: !note.lockStatus?.isLocked,
                password: password,
              },
            }
          : note
      );
      console.log("New notes state after lock:", newNotes); // Debug log
      return newNotes;
    });
  };

  const filterAndSortNotes = (
    notes,
    { searchQuery, sortBy, selectedLabel, showPinnedOnly }
  ) => {
    let filteredNotes = [...notes];

    // Filter by pinned status
    if (showPinnedOnly) {
      filteredNotes = filteredNotes.filter((note) => note.isPinned);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredNotes = filteredNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
    }

    // Filter by label
    if (selectedLabel) {
      filteredNotes = filteredNotes.filter((note) =>
        note.labels.some((label) => label.name === selectedLabel)
      );
    }

    // Sort notes only if sortBy is explicitly set
    if (sortBy !== "manual") {
      switch (sortBy) {
        case "newest":
          filteredNotes.sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt) -
              new Date(a.updatedAt || a.createdAt)
          );
          break;
        case "oldest":
          filteredNotes.sort(
            (a, b) =>
              new Date(a.updatedAt || a.createdAt) -
              new Date(b.updatedAt || b.createdAt)
          );
          break;
        case "title":
          filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          break;
      }
    }

    // Sort pinned notes by pinnedAt (most recent first)
    if (showPinnedOnly) {
      filteredNotes.sort((a, b) => {
        const pinnedAtA = a.pinnedAt ? new Date(a.pinnedAt) : new Date(0);
        const pinnedAtB = b.pinnedAt ? new Date(b.pinnedAt) : new Date(0);
        return pinnedAtB - pinnedAtA;
      });
    }

    return filteredNotes;
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    lockNote,
    filterAndSortNotes,
    loading,
  };
};

export default useNoteManagement;
