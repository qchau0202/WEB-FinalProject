import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useNoteManagement from "../hooks/useNoteManagement";
import Note from "../components/notes/Note";
import { Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTheme } from "../contexts/ThemeContext";

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, updateNote, deleteNote } = useNoteManagement();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    setTimeout(() => {
      const foundNote = notes.find((note) => note.uuid.toString() === id);
      setNote(foundNote);
      setLoading(false);
    }, 300);
  }, [id, notes]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!note) {
    return (
      <div
        className={`p-8 min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-4 mt-20">
          <h2
            className={`text-2xl font-medium ${
              theme === "dark" ? "text-gray-100" : "text-gray-700"
            }`}
          >
            Note not found
          </h2>
          <p
            className={
              theme === "dark"
                ? "text-gray-400 text-lg"
                : "text-gray-500 text-lg"
            }
          >
            The note you're looking for doesn't exist or has been deleted.
          </p>
          <Button
            type="primary"
            onClick={() => navigate("/")}
            icon={<ArrowLeftOutlined />}
            className="text-lg"
          >
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen p-6`}
    >
      <Note
        note={note}
        onUpdate={updateNote}
        onDelete={deleteNote}
        viewMode="grid"
        isDetailView={true}
      />
    </div>
  );
};

export default NoteDetail;
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useNotes } from "../contexts/NotesContext";
// import Note from "../components/notes/Note";
// import { Spin } from "antd";
// import toast from "react-hot-toast";

// const NoteDetail = () => {
//   const { uuid } = useParams();
//   const navigate = useNavigate();
//   const { notes, loading, updateNote, deleteNote, fetchNotes } = useNotes();
//   const [note, setNote] = useState(null);

//   useEffect(() => {
//     const fetchNote = async () => {
//       try {
//         await fetchNotes();
//         const foundNote = notes.find((n) => n.uuid === uuid);
//         if (foundNote) {
//           setNote(foundNote);
//         } else {
//           toast.error("Note not found");
//           navigate("/");
//         }
//       } catch (error) {
//         toast.error("Failed to fetch note");
//         navigate("/");
//       }
//     };

//     fetchNote();
//   }, [uuid, fetchNotes, notes, navigate]);

//   const handleUpdate = async (updatedData) => {
//     try {
//       await updateNote(uuid, { ...note, ...updatedData });
//       setNote((prev) => ({ ...prev, ...updatedData }));
//     } catch (error) {
//       toast.error("Failed to update note");
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteNote(uuid);
//       navigate("/");
//     } catch (error) {
//       toast.error("Failed to delete note");
//     }
//   };

//   const handlePin = async () => {
//     try {
//       await updateNote(uuid, {
//         ...note,
//         isPinned: !note.isPinned,
//         pinnedAt: !note.isPinned ? new Date().toISOString() : null,
//       });
//       setNote((prev) => ({
//         ...prev,
//         isPinned: !prev.isPinned,
//         pinnedAt: !prev.isPinned ? new Date().toISOString() : null,
//       }));
//     } catch (error) {
//       toast.error("Failed to pin/unpin note");
//     }
//   };

//   const handleLock = async (password, lockFeatureEnabled, isLocked) => {
//     try {
//       await updateNote(uuid, {
//         ...note,
//         lockStatus: {
//           isLocked,
//           password: lockFeatureEnabled ? password : null,
//         },
//         lockFeatureEnabled,
//       });
//       setNote((prev) => ({
//         ...prev,
//         lockStatus: {
//           isLocked,
//           password: lockFeatureEnabled ? password : null,
//         },
//         lockFeatureEnabled,
//       }));
//     } catch (error) {
//       toast.error("Failed to update note lock status");
//     }
//   };

//   if (loading || !note) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 lg:p-8 mx-auto max-w-5xl">
//       <Note
//         note={note}
//         onUpdate={handleUpdate}
//         onDelete={handleDelete}
//         onPin={handlePin}
//         onLock={handleLock}
//         viewMode="detail"
//         isDetailView={true}
//       />
//     </div>
//   );
// };

// export default NoteDetail;
