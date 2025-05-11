import { useState } from "react";
import useNoteManagement from "../hooks/useNoteManagement";
import Note from "../components/notes/Note";
import NoteCreateCard from "../components/notes/NoteCreateCard";
import { Empty, Spin } from "antd";
import { useLabel } from "../contexts/LabelsContext";
import { useNavigate } from "react-router-dom";
import notificationsData from "../mock-data/notifications";
import NotePinnedSection from "../components/notes/NotePinnedSection";
import FunctionBar from "../components/common/FunctionBar";

const Home = () => {
  const navigate = useNavigate();
  const { selectedLabel } = useLabel();
  const {
    notes,
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
    <div className="overflow-y-auto h-full">
      <div className="p-4 md:p-6 lg:p-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 truncate">
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
                {sortedNotes.map((note, index) => (
                  <div key={note.id} className="w-full">
                    <Note
                      note={note}
                      index={index}
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
                {sortedNotes.map((note, index) => (
                  <div key={note.id}>
                    <Note
                      note={note}
                      index={index}
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
