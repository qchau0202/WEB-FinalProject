import NoteTags from "./NoteTags";
import { PictureOutlined, FileOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const NoteContent = ({
  content,
  setContent,
  tags,
  onAddTag,
  isDetailView,
  viewMode,
  handleInput,
  title,
  handleFileUpload,
}) => {
  return (
    <div className={`flex flex-col ${isDetailView ? "flex-1" : ""}`}>
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          handleInput(title, e.target.value);
        }}
        className={`px-5 bg-transparent border-none focus:outline-none text-gray-600 w-full resize-none ${
          isDetailView ? "text-lg" : "text-base"
        }`}
        placeholder="Write your note here..."
        rows={isDetailView ? 10 : viewMode === "grid" ? 3 : 1}
        style={{
          whiteSpace: "pre-wrap",
          minHeight: isDetailView ? "200px" : "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      />
      <div
        className={`flex justify-between items-center px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg ${
          isDetailView ? "p-6" : ""
        }`}
      >
        <NoteTags
          tags={tags}
          onAddTag={onAddTag}
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex gap-3">
          <Tooltip title="Add image">
            <label>
              <div className="p-1 rounded-full hover:bg-gray-200 cursor-pointer">
                <PictureOutlined className="text-gray-500 text-lg" />
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
              <div className="p-1 rounded-full hover:bg-gray-200 cursor-pointer">
                <FileOutlined className="text-gray-500 text-lg" />
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