import { Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import NotePinned from "./NotePinned";
import { useTheme } from "../../contexts/ThemeContext";

const NotePinnedSection = ({
  isPinnedExpanded,
  setIsPinnedExpanded,
  pinnedNotes,
  handleNoteClick,
  togglePinNote,
}) => {
  const { theme } = useTheme();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-lg font-medium ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Pinned Notes
        </h2>
        {pinnedNotes.length > 0 && (
          <Button
            type="text"
            onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
            className={`flex items-center gap-1 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {isPinnedExpanded ? (
              <UpOutlined />
            ) : (
              <DownOutlined />
            )}
          </Button>
        )}
      </div>
      {isPinnedExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pinnedNotes.map((note) => (
            <div key={note.uuid} className="w-full">
              <NotePinned
                note={note}
                handleNoteClick={handleNoteClick}
                togglePinNote={togglePinNote}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotePinnedSection;
