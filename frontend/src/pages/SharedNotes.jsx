import { useState } from "react";
import useNoteManagement from "../hooks/useNoteManagement";
import Note from "../components/notes/Note";
import { Empty, Spin } from "antd";
import { useTheme } from "../contexts/ThemeContext";
import FunctionBar from "../components/common/FunctionBar";

const SharedNotes = () => {
  const {
    notes,
    updateNote,
    deleteNote,
    filterAndSortNotes,
    loading,
    togglePinNote,
    lockNote,
  } = useNoteManagement();
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("manual");

  const sharedNotes = notes.filter(
    (note) => Array.isArray(note.collaborators) && note.collaborators.length > 0
  );

  const sortedNotes = filterAndSortNotes(sharedNotes, {
    searchQuery,
    sortBy,
    selectedLabel: null,
    showPinnedOnly: false,
  });

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
            Shared Notes
          </h1>
          <div className="flex-shrink-0">
            <FunctionBar
              onSearch={setSearchQuery}
              onSort={setSortBy}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spin size="large" />
          </div>
        ) : sortedNotes.length === 0 ? (
          <Empty description="No shared notes found." />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mt-6">
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
          <div className="flex flex-col gap-3 mt-6">
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
    </div>
  );
};
export default SharedNotes;
