import NotePinned from "./NotePinned";
import { Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";

const NotePinnedSection = ({
  isPinnedExpanded,
  setIsPinnedExpanded,
  displayedPinnedNotes,
  handleNoteClick,
  togglePinNote,
  // eslint-disable-next-line no-unused-vars
  remainingPinnedCount,
}) => {
  const { theme } = useTheme();

  return (
    <>
      <div className="mb-8">
        <div
          className={`flex items-center justify-between cursor-pointer mb-4 ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
          onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Pinned Notes</h2>
            <Button
              type="text"
              icon={isPinnedExpanded ? <DownOutlined /> : <UpOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setIsPinnedExpanded(!isPinnedExpanded);
              }}
              className={`border-1 ${
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
              }`}
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
// import React from "react";
// import { Button } from "antd";
// import { PushpinOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
// import Note from "./Note";

// const NotePinnedSection = ({
//   pinnedNotes,
//   isExpanded,
//   onToggleExpand,
//   viewMode,
//   onUpdate,
//   onDelete,
//   onPin,
//   onLock,
//   onInvite,
// }) => {
//   if (!pinnedNotes || pinnedNotes.length === 0) return null;

//   return (
//     <div className="mb-6">
//       <div className="flex items-center gap-2 mb-4">
//         <PushpinOutlined className="text-gray-500" />
//         <span className="text-gray-500">Pinned Notes</span>
//         <Button
//           type="text"
//           icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
//           onClick={onToggleExpand}
//           className="ml-auto"
//         />
//       </div>
//       {isExpanded && (
//         <div
//           className={`grid gap-4 ${
//             viewMode === "grid"
//               ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
//               : "grid-cols-1"
//           }`}
//         >
//           {pinnedNotes.map((note) => (
//             <Note
//               key={note.uuid}
//               note={note}
//               viewMode={viewMode}
//               onUpdate={onUpdate}
//               onDelete={onDelete}
//               onPin={onPin}
//               onLock={onLock}
//               onInvite={onInvite}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotePinnedSection;
