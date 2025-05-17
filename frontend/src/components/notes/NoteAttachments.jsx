import {
  FileOutlined,
  PictureOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNote } from "../../contexts/NotesContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button, Tooltip, Modal } from "antd";
import { attachmentService } from "../../services/attachmentService";
import { FaPaperclip } from "react-icons/fa6";

const NoteAttachments = () => {
  const { note, isDetailView, attachments, refreshAttachments, permission } =
    useNote();
  const { themeClasses, fontSize } = useTheme();

  // Fetch attachments on mount or when note changes
  useEffect(() => {
    if (!note?.uuid) return;
    refreshAttachments().catch(() => toast.error("Failed to load attachments"));
  }, [note?.uuid, refreshAttachments]);

  const handleDelete = async (attachmentId) => {
    try {
      await attachmentService.deleteAttachment(note.uuid, attachmentId);
      toast.success("Attachment deleted successfully");
      await refreshAttachments();
    } catch (error) {
      console.error("Failed to delete attachment:", error);
      toast.error("Failed to delete attachment");
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  // Only show count in grid/list view
  if (!isDetailView) {
    if (!attachments || attachments.length === 0) return null;
    return (
      <div
        className={`flex justify-end items-center gap-1 px-4 py-2 rounded-b-lg ${themeClasses.bg.secondary}`}
      >
        <Tooltip
          title={
            <div className="flex flex-col gap-2 ${themeClasses.bg.primary}">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 justify-between "
                >
                  <span className="text-white truncate max-w-[200px]">
                    {file.original_filename}
                  </span>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.id);
                    }}
                    disabled={permission !== "owner" && permission !== "edit"}
                  />
                </div>
              ))}
            </div>
          }
          placement="topRight"
          style={{
            padding: "8px",
            backgroundColor: themeClasses.bg.primary,
          }}
        >
          <div className="flex items-center gap-1 cursor-pointer">
            <div
              className={`${themeClasses.text.muted} ${themeClasses.font[fontSize]}`}
            >
              <FaPaperclip />
            </div>
            <span
              className={`${themeClasses.text.muted} ${themeClasses.font[fontSize]}`}
            >
              {attachments.length}
            </span>
            <p
              className={`${themeClasses.text.muted} ${themeClasses.font[fontSize]}`}
            >
              attachment(s)
            </p>
          </div>
        </Tooltip>
      </div>
    );
  }

  // In detail view, show nothing if no attachments
  if (!attachments || attachments.length === 0) return null;

  // Responsive: show modal on mobile, grid on desktop
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (isDetailView && isMobile) {
    return (
      <div
        className={`p-4 border-t rounded-b-lg ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}
      >
        <div
          className="flex items-center gap-2 cursor-pointer w-fit"
          onClick={() => setModalOpen(true)}
        >
          <FileOutlined className={`text-lg ${themeClasses.text.muted}`} />
          <span className={`${themeClasses.font[fontSize]} font-medium`}>
            Attachments ({attachments.length})
          </span>
        </div>
        <Modal
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
          title={`Attachments (${attachments.length})`}
          className="max-w-xs"
          style={{ maxHeight: "60vh", overflowY: "auto", padding: 8 }}
        >
          <div className="flex flex-col gap-2">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 justify-between border-b pb-2 last:border-b-0 last:pb-0"
              >
                {file.mime_type.match(/^image\//i) ? (
                  <PictureOutlined
                    className={`text-base ${themeClasses.text.muted}`}
                  />
                ) : (
                  <FileOutlined
                    className={`text-base ${themeClasses.text.muted}`}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div
                    className={`truncate ${themeClasses.text.primary} text-sm`}
                  >
                    {file.original_filename}
                  </div>
                  <div className={`text-xs ${themeClasses.text.muted}`}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file.id);
                  }}
                  disabled={permission !== "owner" && permission !== "edit"}
                />
              </div>
            ))}
          </div>
        </Modal>
      </div>
    );
  }

  // Detailed view UI (desktop)
  return (
    <div
      className={`p-4 sm:p-6 border-t rounded-b-lg ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}
    >
      <h1
        className={`${themeClasses.font[fontSize]} font-medium mb-3 flex items-center ${themeClasses.text.primary}`}
      >
        <FileOutlined className={`mr-2 text-lg ${themeClasses.text.muted}`} />
        Attachments ({attachments.length})
      </h1>
      <div className="flex flex-col gap-2 md:grid md:grid-cols-2 lg:grid-cols-3">
        {attachments.map((file) => (
          <div
            key={file.id}
            className={`flex items-center gap-2 p-2 sm:p-3 rounded-md hover:shadow-sm border ${themeClasses.border.primary} ${themeClasses.text.primary}`}
          >
            {file.mime_type.match(/^image\//i) ? (
              <PictureOutlined
                className={`text-lg ${themeClasses.text.muted}`}
              />
            ) : (
              <FileOutlined className={`text-lg ${themeClasses.text.muted}`} />
            )}
            <div className="overflow-hidden flex-1 min-w-0">
              <div
                className={`${themeClasses.font[fontSize]} truncate ${themeClasses.text.primary}`}
              >
                {file.original_filename}
              </div>
              <div
                className={`${themeClasses.font.small} ${themeClasses.text.muted}`}
              >
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(file.id);
              }}
              disabled={permission !== "owner" && permission !== "edit"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteAttachments;
