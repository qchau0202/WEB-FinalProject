import NotePinned from "./NotePinned";
import { Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const NotePinnedSection = ({ isPinnedExpanded, setIsPinnedExpanded, displayedPinnedNotes, handleNoteClick, togglePinNote, remainingPinnedCount }) => {
    return (
      <>
        <div className="mb-8">
          <div
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
          >
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Pinned Notes
              </h2>
              <Button
                type="text"
                icon={isPinnedExpanded ? <DownOutlined /> : <UpOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPinnedExpanded(!isPinnedExpanded);
                }}
                className="border-1"
              />
            </div>
          </div>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isPinnedExpanded
                ? "opacity-100 max-h-[500px]"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <div className="flex gap-4">
              {displayedPinnedNotes.map((note) => (
                <NotePinned
                  key={note.id}
                  note={note}
                  handleNoteClick={handleNoteClick}
                  togglePinNote={togglePinNote}
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
};

export default NotePinnedSection;
