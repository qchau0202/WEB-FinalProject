import { useReducer, useEffect } from "react";
import { notes as defaultNotes } from "../mock-data/notes";

const initialState = {
  notes: [],
  selectedSpace: null,
};

const noteReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTES":
      return { ...state, notes: action.payload };
    case "ADD_NOTE":
      return { ...state, notes: [...state.notes, action.payload] };
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? { ...note, ...action.payload } : note
        ),
      };
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };
    case "SET_SPACE":
      return { ...state, selectedSpace: action.payload };
    default:
      return state;
  }
};

const useNoteManagement = () => {
  const initialNotes =
    JSON.parse(localStorage.getItem("notes"))?.map((note, idx) => ({
      ...note,
      order: note.order ?? idx, // default to index if no order
    })) || defaultNotes.map((note, idx) => ({ ...note, order: idx }));

  const [state, dispatch] = useReducer(noteReducer, {
    ...initialState,
    notes: [...initialNotes],
  });

  let nextId = Math.max(...state.notes.map((n) => n.id), 0) + 1;

  const getNextId = () => {
    return nextId++;
  };

  const addNote = (note) => {
    const newNote = { ...note, id: getNextId(), order: 0 };

    // Shift all existing notes forward
    const updatedNotes = state.notes.map((n) => ({
      ...n,
      order: n.order + 1,
    }));

    const finalNotes = [newNote, ...updatedNotes];

    dispatch({ type: "SET_NOTES", payload: finalNotes });
    localStorage.setItem("notes", JSON.stringify(finalNotes));
  };

  const updateNote = (note) => {
    dispatch({ type: "UPDATE_NOTE", payload: note });
    const updatedNotes = state.notes.map((n) =>
      n.id === note.id ? { ...n, ...note } : n
    );
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const deleteNote = (id) => {
    dispatch({ type: "DELETE_NOTE", payload: id });
    const updatedNotes = state.notes.filter((note) => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const setSpace = (spaceId) => {
    dispatch({ type: "SET_SPACE", payload: spaceId });
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(state.notes));
  }, [state.notes]);

  return {
    notes: state.notes,
    selectedSpace: state.selectedSpace,
    addNote,
    updateNote,
    deleteNote,
    setSpace,
  };
};

export default useNoteManagement;
