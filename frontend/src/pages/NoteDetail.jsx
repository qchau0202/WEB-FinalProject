import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useNoteManagement from "../hooks/useNoteManagement";
import Note from "../components/notes/Note";
import { Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, updateNote, deleteNote } = useNoteManagement();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const foundNote = notes.find((note) => note.id.toString() === id);
      setNote(foundNote);
      setLoading(false);
    }, 300);
  }, [id, notes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center gap-4 mt-20">
          <h2 className="text-2xl font-medium text-gray-700">Note not found</h2>
          <p className="text-gray-500 text-lg">
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
    <div className="bg-gray-50 min-h-screen p-6">
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
