import { useState, useEffect } from "react";
import useNoteManagement from "../hooks/useNoteManagement";
import Note from "../components/notes/Note";
import NoteCreateCard from "../components/notes/NoteCreateCard";
import { Empty, Spin, message } from "antd";
import { useLabel } from "../contexts/LabelsContext";
import { useNavigate } from "react-router-dom";
import notificationsData from "../mock-data/notifications";
import NotePinnedSection from "../components/notes/NotePinnedSection";
import FunctionBar from "../components/common/FunctionBar";
import { useTheme } from "../contexts/ThemeContext";
import { noteService } from "../services";

const Home = () => {
  const navigate = useNavigate();
  const { selectedLabel } = useLabel();
  const { theme } = useTheme();
  const {
    notes,
    setNotes,
    addNote,
    updateNote,
    deleteNote,
    loading,
    filterAndSortNotes,
    togglePinNote,
    lockNote,
  } = useNoteManagement();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("manual");
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const notifications = notificationsData;

  // Fetch notes when component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await noteService.getAllNotes();
        // Combine own notes and shared notes, use backend fields only
        const allNotes = [...response.own_notes, ...response.shared_notes];
        setNotes(allNotes);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
        message.error("Failed to load notes. Please refresh the page.");
      }
    };

    fetchNotes();
  }, [setNotes]);

  const sortedNotes = filterAndSortNotes(notes, {
    searchQuery,
    sortBy,
    selectedLabel,
    showPinnedOnly: false,
  });

  const pinnedNotes = filterAndSortNotes(notes, {
    searchQuery,
    sortBy,
    selectedLabel,
    showPinnedOnly: true,
  });

  const displayedPinnedNotes = isPinnedExpanded
    ? pinnedNotes
    : pinnedNotes.slice(0, 4);
  const remainingPinnedCount = Math.max(0, pinnedNotes.length - 4);

  const getLabelName = () => {
    if (!selectedLabel) return "All Notes";
    return selectedLabel;
  };

  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  const handleShowMore = (e) => {
    e.stopPropagation();
    setShowAllNotifications(true);
  };

  return (
    <div
      className={`overflow-y-auto h-full  ${
        theme === "dark"
          ? "bg-gray-900 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full"
          : "bg-gray-50 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
      }`}
    >
      <div className="p-4 md:p-6 lg:p-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1
            className={`text-2xl md:text-3xl font-bold truncate ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {getLabelName()}
          </h1>
          <FunctionBar
            onSearch={setSearchQuery}
            onSort={setSortBy}
            onViewModeChange={setViewMode}
            notifications={notifications}
            showAllNotifications={showAllNotifications}
            setShowAllNotifications={setShowAllNotifications}
            notificationVisible={notificationVisible}
            setNotificationVisible={setNotificationVisible}
            handleShowMore={handleShowMore}
          />
        </div>

        {/* Pinned notes section */}
        {pinnedNotes.length > 0 && (
          <NotePinnedSection
            isPinnedExpanded={isPinnedExpanded}
            setIsPinnedExpanded={setIsPinnedExpanded}
            displayedPinnedNotes={displayedPinnedNotes}
            handleNoteClick={handleNoteClick}
            togglePinNote={togglePinNote}
            remainingPinnedCount={remainingPinnedCount}
          />
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="w-full pb-16">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {/* Create New Note Card */}
                <NoteCreateCard addNote={addNote} viewMode={viewMode} />

                {/* Notes Grid */}
                {sortedNotes.map((note) => (
                  <div key={note.uuid} className="w-full">
                    <Note
                      note={note}
                      onUpdate={updateNote}
                      onDelete={deleteNote}
                      onTogglePin={togglePinNote}
                      onLock={lockNote}
                      viewMode={viewMode}
                      isDetailView={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Create New Note Card */}
                <NoteCreateCard addNote={addNote} viewMode={viewMode} />

                {/* Notes List */}
                {sortedNotes.map((note) => (
                  <div key={note.uuid}>
                    <Note
                      note={note}
                      onUpdate={updateNote}
                      onDelete={deleteNote}
                      onTogglePin={togglePinNote}
                      onLock={lockNote}
                      viewMode={viewMode}
                      isDetailView={false}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
