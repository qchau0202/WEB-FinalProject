import {
  FileOutlined,
  PictureOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useNote } from "../../contexts/NotesContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useCallback, useEffect, useState } from "react";
import { attachmentService } from "../../services/attachmentService";
import toast from "react-hot-toast";
import { Button, Spin, Dropdown, Menu } from "antd";

const NoteAttachments = () => {
  const { note, isDetailView, onUpdate, refreshAttachments } = useNote();
  const { themeClasses } = useTheme();
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch attachments on mount or when note changes
  useEffect(() => {
    if (!note?.uuid) return;
    setLoading(true);
    attachmentService
      .getAttachments(note.uuid)
      .then(setAttachments)
      .catch(() => toast.error("Failed to load attachments"))
      .finally(() => setLoading(false));
  }, [note?.uuid]);

  // Drag and drop handler
  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      if (!note?.uuid) return;
      setUploading(true);
      onUpdate(note.uuid, { _isSaving: true });
      let successCount = 0;
      const files = Array.from(e.dataTransfer.files);
      for (const file of files) {
        try {
          await attachmentService.uploadAttachment(note.uuid, file);
          successCount++;
        } catch {
          toast.error(`Failed: ${file.name}`);
        }
      }
      if (successCount > 0) {
        toast.success(`Uploaded ${successCount} file(s)`);
      }
      await refreshAttachments();
      onUpdate(note.uuid, { _isSaving: false });
      setUploading(false);
    },
    [note, onUpdate, refreshAttachments]
  );

  // Delete handler
  const handleDelete = async (attachmentId) => {
    if (!note?.uuid) return;
    onUpdate(note.uuid, { _isSaving: true });
    try {
      await attachmentService.deleteAttachment(note.uuid, attachmentId);
      toast.success("Attachment deleted");
      await refreshAttachments();
    } catch {
      toast.error("Failed to delete attachment");
    }
    onUpdate(note.uuid, { _isSaving: false });
  };

  // Download handler
  const handleDownload = async (attachment) => {
    try {
      const res = await attachmentService.downloadAttachment(
        note.uuid,
        attachment.id
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", attachment.original_filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download file");
    }
  };

  if (!isDetailView) {
    // Minimal UI for grid/list view with delete option
    if (attachments.length === 0) return null;

    const menu = {
      items: attachments.map((file) => ({
        key: file.id,
        label: (
          <div className="flex justify-between gap-2">
            <span className="truncate max-w-[120px] flex-1">
              {file.original_filename}
            </span>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
              onClick={() => handleDelete(file.id)}
            />
          </div>
        ),
      })),
    };

    return (
      <div
        className={`flex items-center gap-1 px-4 py-2 rounded-b-lg ${themeClasses.bg.secondary}`}
      >
        <div className={themeClasses.text.muted}>
          <FileOutlined />
        </div>
        <span className={themeClasses.text.muted}>{attachments.length}</span>
        <Dropdown menu={menu} trigger={["click"]} placement="topRight">
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            className={themeClasses.text.muted}
            style={{ marginLeft: 4 }}
          />
        </Dropdown>
      </div>
    );
  }

  // Detailed view UI
  return (
    <>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: "2px dashed #aaa",
          borderRadius: 8,
          padding: 24,
          textAlign: "center",
          margin: 16,
          color: uploading ? "#1976d2" : "#888",
          background: uploading ? themeClasses.bg.primary : undefined,
          transition: "background 0.2s, color 0.2s",
        }}
      >
        {uploading ? <Spin /> : "Drag and drop files here to upload"}
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-6">
          <Spin />
        </div>
      ) : (
        attachments.length > 0 && (
          <div
            className={`p-6 border-t ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}
          >
            <h1
              className={`text-base font-medium mb-3 flex items-center ${themeClasses.text.primary}`}
            >
              <FileOutlined
                className={`mr-2 text-lg ${themeClasses.text.muted}`}
              />
              Attachments ({attachments.length})
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center gap-2 p-3 rounded-md hover:shadow-sm border ${themeClasses.border.primary} ${themeClasses.text.primary}`}
                >
                  {file.mime_type.match(/^image\//i) ? (
                    <PictureOutlined
                      className={`text-lg ${themeClasses.text.muted}`}
                    />
                  ) : (
                    <FileOutlined
                      className={`text-lg ${themeClasses.text.muted}`}
                    />
                  )}
                  <div className="overflow-hidden flex-1 min-w-0">
                    <div
                      className={`text-base truncate ${themeClasses.text.primary}`}
                    >
                      {file.original_filename}
                    </div>
                    <div className={`text-sm ${themeClasses.text.muted}`}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(file)}
                  />
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDelete(file.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default NoteAttachments;
