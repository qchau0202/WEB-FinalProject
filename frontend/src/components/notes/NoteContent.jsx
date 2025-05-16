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
  const { fontSize, themeClasses } = useTheme();

  return (
    <div className={`flex flex-col ${isDetailView ? "flex-1" : ""}`}>
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          handleInput(title, e.target.value);
        }}
        className={`px-5 bg-transparent border-none focus:outline-none w-full resize-none ${themeClasses.text.primary} ${themeClasses.font[fontSize]}`}
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
          themeClasses.border.primary
        } ${themeClasses.bg.secondary} rounded-b-lg ${
          isDetailView ? "p-6" : ""
        } overflow-hidden`}
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
                className={`p-1 rounded-full ${themeClasses.bg.hover} ${themeClasses.text.light} cursor-pointer`}
              >
                <PictureOutlined
                  className={`${themeClasses.text.muted} text-lg`}
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
                className={`p-1 rounded-full ${themeClasses.bg.hover} ${themeClasses.text.light} cursor-pointer`}
              >
                <FileOutlined
                  className={`${themeClasses.text.muted} text-lg`}
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
