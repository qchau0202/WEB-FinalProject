import { useState, useEffect } from "react";
import { noteService } from "../services";

const NOTES_CACHE_KEY = "notelit-notes-cache";
const AUTOSAVE_DEBOUNCE = 500; // ms

const useNoteManagement = () => {
  // Initialize notes from localStorage for instant render
  const [notes, setNotes] = useState(() => {
    const cached = localStorage.getItem(NOTES_CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  const [loading] = useState(false);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(NOTES_CACHE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = (note) => {
    if (!note.title?.trim() && !note.content?.trim()) return;
    setNotes((prevNotes) => [note, ...prevNotes]);
  };

  const updateNote = async (noteUuid, updateFields) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.uuid === noteUuid
          ? { ...note, ...updateFields, _isSaving: true }
          : note
      )
    );
    try {
      const note = notes.find((n) => n.uuid === noteUuid);
      // Only send minimal fields to backend, and always map labels to IDs
      let payload = { ...updateFields };
      if (updateFields.labels) {
        payload.labels = updateFields.labels.map((l) =>
          typeof l === "object" ? l.id : l
        );
      } else if (note.labels) {
        payload.labels = note.labels.map((l) =>
          typeof l === "object" ? l.id : l
        );
      }
      const response = await noteService.updateNote(noteUuid, payload);
      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n.uuid === noteUuid ? { ...response.note, _isSaving: false } : n
        )
      );
    } catch (err) {
      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n.uuid === noteUuid ? { ...n, _isSaving: false } : n
        )
      );
      console.error("Update failed:", err);
      throw err;
    }
  };

  const deleteNote = (noteUuid) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.uuid !== noteUuid));
  };

  const togglePinNote = async (noteUuid) => {
    try {
      const note = notes.find((n) => n.uuid === noteUuid);
      if (!note) {
        console.error("Note not found:", noteUuid);
        return;
      }

      const toggledIsPinned = !note.is_pinned;
      const toggledPinnedAt = toggledIsPinned ? new Date().toISOString() : null;

      const updatedNote = {
        ...note,
        is_pinned: toggledIsPinned,
        pinned_at: toggledPinnedAt,
        _isSaving: true,
      };
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.uuid === noteUuid ? updatedNote : n))
      );

      const response = await noteService.updateNote(noteUuid, {
        is_pinned: toggledIsPinned,
        pinned_at: toggledPinnedAt,
        title: updatedNote.title,
        content: updatedNote.content,
        labels: updatedNote.labels,
      });

      const backendNote = response.note;
      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n.uuid === noteUuid
            ? {
                ...n,
                is_pinned: backendNote.is_pinned,
                pinned_at: backendNote.pinned_at,
                _isSaving: false,
              }
            : n
        )
      );
    } catch (err) {
      console.error("Pin/unpin failed:", err);
      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n.uuid === noteUuid ? { ...n, _isSaving: false } : n
        )
      );
    }
  };

  const filterAndSortNotes = (
    notes,
    { searchQuery, sortBy, selectedLabel, showPinnedOnly }
  ) => {
    let filteredNotes = [...notes];

    if (showPinnedOnly) {
      filteredNotes = filteredNotes.filter((note) => note.is_pinned);
      // Don't apply label filter to pinned notes
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredNotes = filteredNotes.filter(
          (note) =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
        );
      }
    } else {
      // For main notes list, DO NOT filter out pinned notes
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredNotes = filteredNotes.filter(
          (note) =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
        );
      }
      if (selectedLabel) {
        filteredNotes = filteredNotes.filter((note) =>
          note.labels?.some((label) => label.name === selectedLabel)
        );
      }
    }

    // Apply sorting
    if (sortBy !== "manual") {
      switch (sortBy) {
        case "newest":
          filteredNotes.sort(
            (a, b) =>
              new Date(b.updated_at || b.created_at) -
              new Date(a.updated_at || a.created_at)
          );
          break;
        case "oldest":
          filteredNotes.sort(
            (a, b) =>
              new Date(a.updated_at || a.created_at) -
              new Date(b.updated_at || b.created_at)
          );
          break;
        case "title":
          filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          break;
      }
    }

    // Sort pinned notes by pinned_at date
    if (showPinnedOnly) {
      filteredNotes.sort((a, b) => {
        const pinnedAtA = a.pinned_at ? new Date(a.pinned_at) : new Date(0);
        const pinnedAtB = b.pinned_at ? new Date(b.pinned_at) : new Date(0);
        return pinnedAtB - pinnedAtA;
      });
    }

    return filteredNotes;
  };

  return {
    notes,
    setNotes,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    filterAndSortNotes,
    loading,
  };
};

export default useNoteManagement;
