import NoteLabels from "./NoteLabels";
import { PictureOutlined, FileOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useNote } from "../../contexts/NotesContext";
import { useTheme } from "../../contexts/ThemeContext";

const NoteContent = () => {
  const {
    content,
    setContent,
    isDetailView,
    viewMode,
    handleInput,
    title,
    handleFileUpload,
  } = useNote();
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col ${isDetailView ? "flex-1" : ""}`}>
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          handleInput(title, e.target.value);
        }}
        className={`px-5 bg-transparent border-none focus:outline-none w-full resize-none ${
          isDetailView ? "text-lg" : "text-base"
        } ${theme === "dark" ? "text-gray-200" : "text-gray-600"}`}
        placeholder="Write your note here..."
        rows={
          isDetailView
            ? 10
            : viewMode === "grid"
            ? 3
            : viewMode === "list"
            ? 4
            : 1
        }
        style={{
          whiteSpace: "pre-wrap",
          minHeight: isDetailView
            ? "200px"
            : viewMode === "list"
            ? "80px"
            : "auto",
          maxWidth: "100%",
          overflow: "hidden",
          wordBreak: "break-word",
        }}
        onClick={(e) => e.stopPropagation()}
      />
      <div
        className={`flex items-center px-5 py-3 border-t ${
          theme === "dark"
            ? "border-gray-700 bg-gray-800"
            : "border-gray-100 bg-gray-50"
        } rounded-b-lg ${isDetailView ? "p-6" : ""} overflow-hidden`}
      >
        <div
          className="flex items-center"
          style={
            isDetailView ? {} : { maxWidth: 220, minWidth: 120, flexShrink: 0 }
          }
        >
          <NoteLabels />
        </div>
        <div className="flex-grow" />
        <div className="flex-shrink-0 flex gap-2 ml-2">
          <Tooltip title="Add image">
            <label>
              <div
                className={`p-1 rounded-full ${
                  theme === "dark" ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200"
                } cursor-pointer`}
              >
                <PictureOutlined
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  } text-lg`}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  e.stopPropagation();
                  const file = e.target.files[0];
                  handleFileUpload(file);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </label>
          </Tooltip>
          <Tooltip title="Add file">
            <label>
              <div
                className={`p-1 rounded-full ${
                  theme === "dark" ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200"
                } cursor-pointer`}
              >
                <FileOutlined
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  } text-lg`}
                />
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  e.stopPropagation();
                  const file = e.target.files[0];
                  handleFileUpload(file);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </label>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default NoteContent;
// import React from "react";
// import NoteLabels from "./NoteLabels";
// import { PictureOutlined, FileOutlined } from "@ant-design/icons";
// import { Tooltip } from "antd";

// const NoteContent = ({
//   note = {},
//   isDetailView = false,
//   viewMode = "grid",
//   onUpdate = () => {},
//   onFileUpload = () => {},
// }) => {
//   return (
//     <div className={`flex flex-col ${isDetailView ? "flex-1" : ""}`}>
//       <textarea
//         value={note?.content || ""}
//         onChange={(e) => onUpdate({ content: e.target.value })}
//         className={`px-5 bg-transparent border-none focus:outline-none text-gray-600 w-full resize-none ${
//           isDetailView ? "text-lg" : "text-base"
//         }`}
//         placeholder="Write your note here..."
//         rows={
//           isDetailView
//             ? 10
//             : viewMode === "grid"
//             ? 3
//             : viewMode === "list"
//             ? 4
//             : 1
//         }
//         style={{
//           whiteSpace: "pre-wrap",
//           minHeight: isDetailView
//             ? "200px"
//             : viewMode === "list"
//             ? "80px"
//             : "auto",
//           maxWidth: "100%",
//           overflow: "hidden",
//           wordBreak: "break-word",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       />
//       <div
//         className={`flex items-center px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg ${
//           isDetailView ? "p-6" : ""
//         } overflow-hidden`}
//       >
//         <div
//           className="flex items-center"
//           style={
//             isDetailView ? {} : { maxWidth: 220, minWidth: 120, flexShrink: 0 }
//           }
//         >
//           <NoteLabels note={note} onUpdate={onUpdate} />
//         </div>
//         <div className="flex-grow" />
//         <div className="flex-shrink-0 flex gap-2 ml-2">
//           <Tooltip title="Add image">
//             <label>
//               <div className="p-1 rounded-full hover:bg-gray-200 cursor-pointer">
//                 <PictureOutlined className="text-gray-500 text-lg" />
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => {
//                   e.stopPropagation();
//                   const file = e.target.files[0];
//                   if (file) onFileUpload(file);
//                 }}
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </label>
//           </Tooltip>
//           <Tooltip title="Add file">
//             <label>
//               <div className="p-1 rounded-full hover:bg-gray-200 cursor-pointer">
//                 <FileOutlined className="text-gray-500 text-lg" />
//               </div>
//               <input
//                 type="file"
//                 className="hidden"
//                 onChange={(e) => {
//                   e.stopPropagation();
//                   const file = e.target.files[0];
//                   if (file) onFileUpload(file);
//                 }}
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </label>
//           </Tooltip>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoteContent;
