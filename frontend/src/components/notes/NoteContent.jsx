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
    permission,
  } = useNote();
  const { fontSize, themeClasses } = useTheme();

  // Handler for file/image input
  const onFileChange = (e) => {
    e.stopPropagation();
    const files = Array.from(e.target.files);
    if (files.length > 0) handleFileUpload(files);
    e.target.value = null; // reset input
  };

  return (
    <div className={`flex flex-col flex-1 min-h-0`}>
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          handleInput(title, e.target.value);
        }}
        className={`px-5 bg-transparent border-none focus:outline-none w-full resize-none ${
          themeClasses.text.primary
        } ${themeClasses.font[fontSize]} ${
          isDetailView ? "min-h-[200px] max-h-[40vh] overflow-y-auto" : ""
        }`}
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
          maxWidth: "100%",
          wordBreak: "break-word",
        }}
        onClick={(e) => e.stopPropagation()}
        readOnly={permission !== "owner" && permission !== "edit"}
      />
      <div
        className={`flex flex-col justify-between gap-2 md:flex-row md:items-center px-5 py-3 border-t ${
          themeClasses.border.primary
        } ${themeClasses.bg.secondary} rounded-b-lg ${
          isDetailView ? "p-6" : ""
        } overflow-hidden`}
      >
        <div
          className={`flex items-center overflow-x-auto md:overflow-visible mb-2`}
          style={
            isDetailView ? {} : { maxWidth: 220, minWidth: 120, flexShrink: 0 }
          }
        >
          <NoteLabels />
        </div>
        <div className="flex-shrink-0 flex gap-2 md:ml-2">
          <Tooltip title="Add image(s)">
            <label>
              <div
                className={`p-1 rounded-full ${themeClasses.bg.hover} ${themeClasses.text.light} cursor-pointer`}
                style={{
                  opacity:
                    permission === "owner" || permission === "edit" ? 1 : 0.5,
                  pointerEvents:
                    permission === "owner" || permission === "edit"
                      ? "auto"
                      : "none",
                }}
              >
                <PictureOutlined
                  className={`${themeClasses.text.muted} text-lg`}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={onFileChange}
                onClick={(e) => e.stopPropagation()}
                disabled={permission !== "owner" && permission !== "edit"}
              />
            </label>
          </Tooltip>
          <Tooltip title="Add file(s)">
            <label>
              <div
                className={`p-1 rounded-full ${themeClasses.bg.hover} ${themeClasses.text.light} cursor-pointer`}
                style={{
                  opacity:
                    permission === "owner" || permission === "edit" ? 1 : 0.5,
                  pointerEvents:
                    permission === "owner" || permission === "edit"
                      ? "auto"
                      : "none",
                }}
              >
                <FileOutlined
                  className={`${themeClasses.text.muted} text-lg`}
                />
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={onFileChange}
                onClick={(e) => e.stopPropagation()}
                disabled={permission !== "owner" && permission !== "edit"}
              />
            </label>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default NoteContent;
