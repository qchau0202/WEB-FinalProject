import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  ExpandOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Menu, Tooltip } from "antd";

const NoteHeader = ({
  title,
  setTitle,
  note,
  isDetailView,
  navigate,
  setConfirmDelete,
  handleInput,
  content,
}) => {
  const menu = (
    <Menu>
      <Menu.Item
        key="delete"
        onClick={(e) => {
          e.domEvent.stopPropagation();
          setConfirmDelete(true);
        }}
      >
        <span className="text-base">Delete Note</span>
      </Menu.Item>
      <Menu.Item key="share" onClick={(e) => e.domEvent.stopPropagation()}>
        <span className="text-base">Share Note</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {isDetailView && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  icon={<ArrowLeftOutlined />}
                  type="text"
                  onClick={() => navigate("/")}
                  className="text-lg"
                />
                <div className="text-base text-gray-500 flex items-center">
                  <span
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() => navigate("/")}
                  >
                    All Notes
                  </span>
                  <span className="mx-2">/</span>
                  <span className="text-gray-700 font-medium truncate max-w-xs">
                    {title || "Untitled"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Tooltip title="Share">
                  <Button icon={<ShareAltOutlined />} className="text-lg" />
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => setConfirmDelete(true)}
                    className="text-lg"
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="p-5 flex justify-between items-start mb-2">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              handleInput(e.target.value, content);
            }}
            className={`font-medium bg-transparent border-none focus:outline-none text-gray-900 w-full ${
              isDetailView ? "text-2xl" : "text-xl"
            }`}
            placeholder="Title"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          />
          <div className="text-sm text-gray-400 mt-1">
            {note.updatedAt
              ? `Updated: ${note.updatedAt}`
              : `Created: ${note.createdAt}`}
          </div>
        </div>
        {!isDetailView && (
          <div className="flex items-center gap-2">
            <Tooltip title="View Details">
              <div
                className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/note/${note.id}`);
                }}
              >
                <ExpandOutlined className="text-gray-400 text-lg" />
              </div>
            </Tooltip>
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <EllipsisOutlined className="text-gray-400 text-lg" />
              </div>
            </Dropdown>
          </div>
        )}
      </div>
    </>
  );
};

export default NoteHeader;
