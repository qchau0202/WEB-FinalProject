import { NoteProvider } from "../../contexts/NotesContext";
import NoteHeader from "./NoteHeader";
import NoteContent from "./NoteContent";
import NoteAttachments from "./NoteAttachments";
import NoteDeleteModal from "./NoteDeleteModal";
import { useNote } from "../../contexts/NotesContext";
import NoteLockModal from "./NoteLockModal";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const LockedNoteView = ({ note, isDetailView, viewMode }) => {
  const { setShowLockModal } = useNote();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleUnlockClick = (e) => {
    e.stopPropagation();
    setShowLockModal(true);
  };

  const handleBackClick = (e) => {
    e.stopPropagation();
    navigate("/");
  };

  if (isDetailView) {
    return (
      <div className="flex items-center justify-center">
        <div className="relative p-10 w-full flex flex-col items-center">
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={handleBackClick}
            className="!absolute !top-4 !left-4"
            style={{ fontWeight: 500 }}
          >
            Back to Home
          </Button>
          <h3
            className={`text-3xl font-semibold mb-4 mt-2 text-center ${
              theme === "dark" ? "text-gray-100" : "text-gray-700"
            }`}
          >
            {note.title || "Untitled"}
          </h3>
          <p
            className={`text-base mb-6 text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            This note is locked
          </p>
          <Button
            icon={<LockOutlined />}
            type="primary"
            size="large"
            onClick={handleUnlockClick}
          >
            Unlock Note
          </Button>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="flex-1 flex flex-row items-center justify-between p-4">
        <div className="flex items-center">
          <h3
            className={`text-lg font-medium ${
              theme === "dark" ? "text-gray-100" : "text-gray-700"
            }`}
          >
            {note.title || "Untitled"}
          </h3>
          <span
            className={`ml-4 text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            (Locked)
          </span>
        </div>
        <Button
          icon={<LockOutlined />}
          type="dashed"
          onClick={handleUnlockClick}
        >
          Unlock
        </Button>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3
        className={`text-2xl font-medium mb-1 ${
          theme === "dark" ? "text-gray-100" : "text-gray-700"
        }`}
      >
        {note.title || "Untitled"}
      </h3>
      <p
        className={`text-sm py-2 ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        This note is locked
      </p>
      <Button icon={<LockOutlined />} type="dashed" onClick={handleUnlockClick}>
        Unlock Note
      </Button>
    </div>
  );
};

const Note = ({
  note,
  onUpdate,
  onDelete,
  onLock,
  viewMode,
  isDetailView = false,
}) => {
  const noteContext = useNote();
  const { theme } = useTheme();

  const handleLock = (noteId, password) => {
    onLock(noteId, password);
  };

  const handleNoteClick = (e) => {
    if (note.lockStatus?.isLocked) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };

  return (
    <NoteProvider
      note={note}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onLock={handleLock}
      viewMode={viewMode}
      isDetailView={isDetailView}
    >
      <div
        className={`rounded-lg shadow-sm transition-all relative ${
          isDetailView
            ? "max-w-5xl mx-auto w-full"
            : viewMode === "grid"
            ? "w-full hover:shadow-md"
            : "w-full hover:shadow-md"
        } flex flex-col ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        } border`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => noteContext?.handleDrop(e)}
        onClick={handleNoteClick}
        style={{
          minHeight: isDetailView
            ? "auto"
            : viewMode === "grid"
            ? "220px"
            : "auto",
          height: isDetailView
            ? "auto"
            : viewMode === "list"
            ? "auto"
            : undefined,
          maxWidth: "100%",
        }}
      >
        {note.lockStatus?.isLocked ? (
          <LockedNoteView
            note={note}
            isDetailView={isDetailView}
            viewMode={viewMode}
          />
        ) : (
          <>
            <NoteHeader />
            <NoteContent />
            <NoteAttachments />
          </>
        )}
        <NoteDeleteModal />
        <NoteLockModal />
      </div>
    </NoteProvider>
  );
};

export default Note;
