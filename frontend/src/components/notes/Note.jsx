import { NoteProvider } from "../../contexts/NotesContext";
import NoteHeader from "./NoteHeader";
import NoteContent from "./NoteContent";
import NoteAttachments from "./NoteAttachments";
import NoteDeleteModal from "./NoteDeleteModal";
import { useNote } from "../../contexts/NotesContext";
import NoteLockModal from "./NoteLockModal";
import {
  UnlockOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useEffect } from "react";

const LockedNoteView = ({ note, isDetailView, viewMode }) => {
  const { setShowLockModal, setLockAction, setConfirmDelete } = useNote();
  const navigate = useNavigate();
  const { fontSize, getTitleFontSizeClass, themeClasses } = useTheme();

  const handleUnlockClick = (e) => {
    e.stopPropagation();
    setLockAction("unlock");
    setShowLockModal(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setConfirmDelete(true);
  };

  const handleBackClick = (e) => {
    e.stopPropagation();
    navigate("/");
  };

  if (isDetailView) {
    return (
      <div className="flex items-center justify-center">
        <div className="p-10 w-full">
          <div className="flex justify-between">
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              onClick={handleBackClick}
              style={{ fontWeight: 500 }}
            >
              Back to Home
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={handleDeleteClick}
            />
          </div>
          <div className="flex flex-col items-center">
            <h1
              className={`font-semibold mb-4 mt-2 ${getTitleFontSizeClass(
                fontSize
              )} ${themeClasses.text.primary}`}
            >
              {note.title || "Untitled"}
            </h1>
            <p className={`text-base mb-6 ${themeClasses.text.secondary}`}>
              This note is locked for privacy
            </p>
            <Button
              icon={<UnlockOutlined />}
              type="dashed"
              size="large"
              onClick={handleUnlockClick}
            >
              Unlock Note
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="flex-1 flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <h3
            className={`font-medium mb-2 ${getTitleFontSizeClass(fontSize)} ${
              themeClasses.text.primary
            }`}
          >
            {note.title || "Untitled"}
          </h3>
          <span className={`text-sm ${themeClasses.text.secondary}`}>
            (Locked)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            icon={<UnlockOutlined />}
            type="dashed"
            onClick={handleUnlockClick}
            className="!flex !items-center !gap-2"
          >
            Unlock
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={handleDeleteClick}
          />
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <h3
        className={`font-medium mb-2 ${getTitleFontSizeClass(fontSize)} ${
          themeClasses.text.primary
        }`}
      >
        {note.title || "Untitled"}
      </h3>
      <p className={`text-sm mb-4 text-center ${themeClasses.text.secondary}`}>
        This note is locked for privacy
      </p>
      <div className="flex gap-2">
        <Button
          icon={<UnlockOutlined />}
          type="dashed"
          onClick={handleUnlockClick}
          className="!flex !items-center !gap-2"
        >
          Unlock Note
        </Button>
        <Button icon={<DeleteOutlined />} danger onClick={handleDeleteClick} />
      </div>
    </div>
  );
};

const Note = ({
  note,
  onUpdate,
  onDelete,
  onLock,
  onTogglePin,
  viewMode,
  isDetailView = false,
}) => {
  const noteContext = useNote();
  const [localNote, setLocalNote] = useState(note);
  const { themeClasses } = useTheme();

  // Update local note when prop changes
  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const handleNoteClick = () => {
    // Only block interaction for editing when locked, not for delete
    if (localNote.lock_feature_enabled && localNote.is_locked) {
      // Allow delete modal to open
      // Prevent editing or opening details, but do not block delete
      return;
    }
  };

  const handleLockStateChange = (updatedNote) => {
    setLocalNote(updatedNote);
    // Also update the parent component's state if needed
    onUpdate?.(updatedNote.uuid, updatedNote);
  };

  return (
    <NoteProvider
      note={localNote}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onLock={onLock}
      onTogglePin={onTogglePin}
      viewMode={viewMode}
      isDetailView={isDetailView}
      onLockStateChange={handleLockStateChange}
    >
      <div
        className={`rounded-lg shadow-sm transition-all relative ${
          isDetailView
            ? "max-w-5xl mx-auto w-full"
            : viewMode === "grid"
            ? "w-full hover:shadow-md"
            : "w-full hover:shadow-md"
        } flex flex-col ${themeClasses.bg.secondary} ${
          themeClasses.border.primary
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
        {localNote.lock_feature_enabled && localNote.is_locked ? (
          <LockedNoteView
            note={localNote}
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
