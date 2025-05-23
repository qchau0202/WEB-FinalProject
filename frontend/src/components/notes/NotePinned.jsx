// import { Button } from "antd";
// import { PushpinOutlined } from "@ant-design/icons";
// import { useTheme } from "../../contexts/ThemeContext";

// const NotePinned = ({ note, handleNoteClick, togglePinNote }) => {
//   const { theme } = useTheme();
//   return (
//     <>
//       <div
//         key={note.id}
//         className={`flex-none w-64 rounded-lg shadow-sm border p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
//           theme === "dark"
//             ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
//             : "bg-white border-gray-200 hover:bg-gray-100"
//         }`}
//         onClick={() => handleNoteClick(note.id)}
//       >
//         <div className="flex items-start justify-between mb-2">
//           <h3
//             className={`font-medium truncate ${
//               theme === "dark" ? "text-gray-100" : "text-gray-900"
//             }`}
//           >
//             {note.title}
//           </h3>
//           <Button
//             icon={<PushpinOutlined />}
//             type={note.isPinned ? "primary" : "text"}
//             size="small"
//             onClick={(e) => {
//               e.stopPropagation();
//               togglePinNote(note.id);
//             }}
//             className={
//               theme === "dark"
//                 ? "text-gray-400 hover:text-blue-400 transition-colors duration-200"
//                 : "text-gray-500 hover:text-blue-500 transition-colors duration-200"
//             }
//           />
//         </div>
//         <div
//           className={`mt-2 flex items-center justify-between text-xs ${
//             theme === "dark" ? "text-gray-400" : "text-gray-500"
//           }`}
//         >
//           <span>
//             {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
//           </span>
//           {note.labels?.length > 0 && (
//             <div
//               className={`text-sm ${
//                 theme === "dark" ? "text-gray-400" : "text-gray-500"
//               }`}
//             >
//               {note.labels.length} labels
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default NotePinned;

import { Button } from "antd";
import { PushpinOutlined } from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";

const NotePinned = ({ note, handleNoteClick, togglePinNote }) => {
  const { theme } = useTheme();

  return (
    <div
      key={note.uuid} // Use uuid for consistency
      className={`flex-none w-full rounded-lg shadow-sm border p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
          : "bg-white border-gray-200 hover:bg-gray-100"
      }`}
      onClick={() => handleNoteClick(note.uuid)} // Use uuid
    >
      <div className="flex items-start justify-between mb-2">
        <h3
          className={`font-medium truncate ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {note.title || "Untitled"}
        </h3>
        <Button
          icon={<PushpinOutlined />}
          type={note.is_pinned ? "primary" : "text"}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            if (typeof togglePinNote === "function") {
              togglePinNote(note.uuid);
            } else {
              console.error("togglePinNote is not a function");
            }
          }}
          className={
            theme === "dark"
              ? "text-gray-400 hover:text-blue-400 transition-colors duration-200"
              : "text-gray-500 hover:text-blue-500 transition-colors duration-200"
          }
        />
      </div>
      <div
        className={`mt-2 flex items-center justify-between text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <span>
          {new Date(note.updated_at || note.created_at).toLocaleDateString()}
        </span>
        {note.labels?.length > 0 && (
          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {note.labels.length} labels
          </div>
        )}
      </div>
    </div>
  );
};

export default NotePinned;
