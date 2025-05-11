import { Button } from "antd";
import { PushpinOutlined } from "@ant-design/icons";

const NotePinned = ({ note, handleNoteClick, togglePinNote }) => {
    return (
      <>
        <div
          key={note.id}
          className="flex-none w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={() => handleNoteClick(note.id)}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
            <Button
              icon={<PushpinOutlined />}
              type={note.isPinned ? "primary" : "text"}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                togglePinNote(note.id);
              }}
              className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>
              {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
            </span>
            {note.labels?.length > 0 && (
              <div className="text-sm text-gray-500">
                {note.labels.length} labels
              </div>
            )}
          </div>
        </div>
      </>
    );
};

export default NotePinned;


