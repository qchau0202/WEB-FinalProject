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
import { useMemo, useCallback } from "react";
import toast from "react-hot-toast";

const LockedNoteView = ({ note, isDetailView, viewMode }) => {
  const { setShowLockModal, setLockAction, setConfirmDelete, permission } =
    useNote();
  const navigate = useNavigate();
  const { fontSize, getTitleFontSizeClass, themeClasses } = useTheme();

  const handleUnlockClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (permission !== "owner") {
        toast.error("Only the note owner can unlock this note.");
        return;
      }
      setLockAction("unlock");
      setShowLockModal(true);
    },
    [setLockAction, setShowLockModal, permission]
  );

  const handleDeleteClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (permission !== "owner") {
        toast.error("Only the note owner can delete this note.");
        return;
      }
      setConfirmDelete(true);
    },
    [setConfirmDelete, permission]
  );

  const handleBackClick = useCallback(
    (e) => {
      e.stopPropagation();
      navigate("/");
    },
    [navigate]
  );

  if (isDetailView) {
    return (
      <div>
        <div className="py-8 px-4 w-full max-w-sm mx-auto flex flex-col justify-center ">
          <div className="hidden md:flex justify-between mb-2">
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              onClick={handleBackClick}
              style={{ fontWeight: 500 }}
              className="md:inline-flex"
            >
              Back to Home
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={handleDeleteClick}
              className="md:ml-2"
            />
          </div>
          <div className="flex flex-col items-center flex-1 justify-center">
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
            <div className="md:hidden flex flex-row gap-3 w-full max-w-xs items-center justify-center">
              <Button
                icon={<UnlockOutlined />}
                type="dashed"
                size="large"
                onClick={handleUnlockClick}
                className="flex-1"
              >
                Unlock Note
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                size="large"
                onClick={handleDeleteClick}
                className="flex-1"
              />
            </div>
            <div className="hidden md:flex w-full max-w-xs items-center justify-center mt-4">
              <Button
                icon={<UnlockOutlined />}
                type="dashed"
                size="large"
                onClick={handleUnlockClick}
                className="w-full"
              >
                Unlock Note
              </Button>
            </div>
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
  const { themeClasses } = useTheme();

  // Memoize the note object to prevent unnecessary re-renders
  const memoizedNote = useMemo(() => note, [note]);

  // Memoize handlers
  const memoizedUpdate = useCallback(onUpdate, [onUpdate]);
  const memoizedDelete = useCallback(onDelete, [onDelete]);
  const memoizedLock = useCallback(onLock, [onLock]);
  const memoizedTogglePin = useCallback(onTogglePin, [onTogglePin]);

  const handleNoteClick = useCallback(() => {
    if (memoizedNote.lock_feature_enabled && memoizedNote.is_locked) {
      return;
    }
  }, [memoizedNote]);

  const handleLockStateChange = useCallback(
    (updatedNote) => {
      memoizedUpdate?.(updatedNote.uuid, updatedNote);
    },
    [memoizedUpdate]
  );

  return (
    <NoteProvider
      note={memoizedNote}
      onUpdate={memoizedUpdate}
      onDelete={memoizedDelete}
      onLock={memoizedLock}
      onTogglePin={memoizedTogglePin}
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
        {memoizedNote.lock_feature_enabled && memoizedNote.is_locked ? (
          <LockedNoteView
            note={memoizedNote}
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
