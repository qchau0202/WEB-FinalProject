import {
  FileOutlined,
  PictureOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useNote } from "../../contexts/NotesContext";
import { useTheme } from "../../contexts/ThemeContext";

const NoteAttachments = () => {
  const { files, isDetailView } = useNote();
  const { theme } = useTheme();

  return (
    <>
      {isDetailView && files.length > 0 && (
        <div
          className={`p-6 border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-100"
          } ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
        >
          <h1
            className={`text-base font-medium mb-3 flex items-center ${
              theme === "dark" ? "text-gray-100" : "text-gray-700"
            }`}
          >
            <PaperClipOutlined
              className={`mr-2 text-lg ${
                theme === "dark" ? "text-gray-300" : "text-gray-500"
              }`}
            />
            Attachments ({files.length})
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {files.map((file, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-3 rounded-md hover:shadow-sm cursor-pointer border ${
                  theme === "dark"
                    ? "border-gray-700 text-white"
                    : "border-gray-200"
                }`}
              >
                {file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <PictureOutlined className="text-lg" />
                ) : (
                  <FileOutlined className="text-lg" />
                )}
                <div className="overflow-hidden">
                  <div
                    className={`text-base truncate ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {file.name}
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {(isDetailView || files.length > 0) && (
        <div
          className={`p-4 border-t rounded-b-lg ${
            theme === "dark"
              ? "border-gray-700 bg-gray-800"
              : "border-gray-100 bg-gray-50"
          }`}
        >
          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {files.length} file{files.length !== 1 ? "s" : ""} attached
          </div>
        </div>
      )}
    </>
  );
};

export default NoteAttachments;
// import React from "react";
// import {
//   FileOutlined,
//   PictureOutlined,
//   PaperClipOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import { Button, Upload } from "antd";

// const NoteAttachments = ({ attachments = [], onUpload, onDelete }) => {
//   const handleUpload = (file) => {
//     onUpload(file);
//     return false; // Prevent default upload behavior
//   };

//   return (
//     <>
//       {attachments.length > 0 && (
//         <div className="p-6 border-t border-gray-100">
//           <h1 className="text-base font-medium text-gray-700 mb-3 flex items-center">
//             <PaperClipOutlined className="mr-2 text-lg" />
//             Attachments ({attachments.length})
//           </h1>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//             {attachments.map((file) => (
//               <div
//                 key={file.id}
//                 className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-md hover:shadow-sm"
//               >
//                 {file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
//                   <PictureOutlined className="text-blue-500 text-lg" />
//                 ) : (
//                   <FileOutlined className="text-blue-500 text-lg" />
//                 )}
//                 <div className="overflow-hidden flex-grow">
//                   <div className="text-base truncate">{file.name}</div>
//                   <div className="text-sm text-gray-500">
//                     {(file.size / 1024 / 1024).toFixed(2)} MB
//                   </div>
//                 </div>
//                 <Button
//                   type="text"
//                   icon={<DeleteOutlined />}
//                   onClick={() => onDelete(file.id)}
//                   className="text-red-500 hover:text-red-700"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//       <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
//         <Upload
//           beforeUpload={handleUpload}
//           showUploadList={false}
//           multiple={false}
//         >
//           <Button type="link" icon={<PaperClipOutlined />}>
//             Add Attachment
//           </Button>
//         </Upload>
//         {attachments.length > 0 && (
//           <div className="text-sm text-gray-500 mt-2">
//             {attachments.length} file{attachments.length !== 1 ? "s" : ""}{" "}
//             attached
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default NoteAttachments;
