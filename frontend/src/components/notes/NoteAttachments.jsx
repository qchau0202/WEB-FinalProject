import {
  FileOutlined,
  PictureOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";

const NoteAttachments = ({ files, isDetailView, note }) => {
  return (
    <>
      {isDetailView && files.length > 0 && (
        <div className="p-6 border-t border-gray-100">
          <h1 className="text-base font-medium text-gray-700 mb-3 flex items-center">
            <PaperClipOutlined className="mr-2 text-lg" />
            Attachments ({files.length})
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-md hover:shadow-sm cursor-pointer"
              >
                {file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <PictureOutlined className="text-blue-500 text-lg" />
                ) : (
                  <FileOutlined className="text-blue-500 text-lg" />
                )}
                <div className="overflow-hidden">
                  <div className="text-base truncate">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {(isDetailView || files.length > 0) && (
        <div className="px-5 py-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
          <div className="text-sm text-gray-500">
            {files.length} file{files.length !== 1 ? "s" : ""} attached
          </div>
        </div>
      )}
      {isDetailView && (
        <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-lg">
          <div className="flex items-center text-base text-gray-500">
            <div className="flex items-center mr-4">
              <span>Created: {note.createdAt}</span>
            </div>
            <div className="flex items-center">
              <span>Updated: {note.updatedAt}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteAttachments;