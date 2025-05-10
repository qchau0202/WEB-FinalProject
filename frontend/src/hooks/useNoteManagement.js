import { useState, useEffect } from "react";
import { notes as mockNotes } from "../mock-data/notes";

const useNoteManagement = (initialNotes = []) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize notes from localStorage if available, otherwise use mockNotes
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      setNotes(mockNotes);
      localStorage.setItem("notes", JSON.stringify(mockNotes));
    }
    setLoading(false);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = (note) => {
    const newNote = {
      ...note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  const updateNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedNote.id
          ? { ...note, ...updatedNote, updatedAt: new Date().toISOString() }
          : note
      )
    );
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
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  const filterAndSortNotes = (
    notes,
    {
      searchQuery = "",
      sortBy = "newest",
      selectedSpace = null,
      showPinnedOnly = false,
    }
  ) => {
    let filteredNotes = notes
      .filter((note) => (selectedSpace ? note.spaceId === selectedSpace : true))
      .filter((note) => (showPinnedOnly ? note.isPinned : true))
      .filter((note) =>
        searchQuery
          ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      );

    // Always sort pinned notes by date (newest first)
    if (showPinnedOnly) {
      return [...filteredNotes].sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);
        return dateB - dateA;
      });
    }

    // For non-pinned notes, use the specified sort
    return [...filteredNotes].sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.updatedAt || a.createdAt) -
          new Date(b.updatedAt || b.createdAt)
        );
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    filterAndSortNotes,
  };
};

export default useNoteManagement;
