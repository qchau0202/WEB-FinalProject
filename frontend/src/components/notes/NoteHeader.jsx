import {
  ArrowLeftOutlined,
  PushpinOutlined,
  DeleteOutlined,
  ExpandOutlined,
  EllipsisOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Button, Dropdown, Tooltip } from "antd";
import { useNote } from "../../contexts/NotesContext";
import { useTheme } from "../../contexts/ThemeContext";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const NoteHeader = () => {
  const {
    note,
    title,
    setTitle,
    content,
    isDetailView,
    navigate,
    setConfirmDelete,
    handleInput,
    handlePin,
    setShowLockModal,
    handleLockConfirm,
  } = useNote();
  const { theme } = useTheme();

  const handleLockClick = (e) => {
    e.stopPropagation();
    if (note.lockStatus?.password && !note.lockStatus?.isLocked) {
      // Directly lock the note if password exists and note is not locked
      handleLockConfirm(note.lockStatus.password, true, true);
    } else {
      // Show modal for setting password or unlocking
      setShowLockModal(true);
    }
  };

  const handleEnableLock = (e) => {
    e.domEvent?.stopPropagation();
    handleLockConfirm(null, true, false); // Enable feature without locking
  };

  const handleDisableLock = (e) => {
    e.domEvent?.stopPropagation();
    setShowLockModal(true); // Show modal for disabling
  };

  const menu = {
    items: isDetailView
      ? [
          {
            key: "lock",
            label: note.lockFeatureEnabled
              ? "Disable Lock Feature"
              : "Enable Lock Feature",
            onClick: note.lockFeatureEnabled
              ? handleDisableLock
              : handleEnableLock,
          },
        ]
      : [
          {
            key: "invite",
            label: "Invite",
            onClick: (e) => e.domEvent.stopPropagation(),
          },
          {
            key: "delete",
            label: "Delete Note",
            onClick: (e) => {
              e.domEvent.stopPropagation();
              setConfirmDelete(true);
            },
          },
          {
            key: "lock",
            label: note.lockFeatureEnabled
              ? "Disable Lock Feature"
              : "Enable Lock Feature",
            onClick: note.lockFeatureEnabled
              ? handleDisableLock
              : handleEnableLock,
          },
        ],
  };

  return (
    <>
      {isDetailView && (
        <div
          className={`border-b ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } sticky top-0 z-10`}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  icon={<ArrowLeftOutlined />}
                  type="text"
                  onClick={() => navigate("/")}
                  className={`text-lg ${
                    theme === "dark" ? "text-gray-200" : "text-gray-600"
                  }`}
                />
                <div
                  className={`text-base ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  } flex items-center`}
                >
                  <span
                    className={`cursor-pointer ${
                      theme === "dark"
                        ? "hover:text-blue-400"
                        : "hover:text-blue-500"
                    }`}
                    onClick={() => navigate("/")}
                  >
                    All Notes
                  </span>
                  <span className="mx-2">/</span>
                  <span
                    className={`${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    } font-medium truncate max-w-xs`}
                  >
                    {title || "Untitled"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Tooltip title={note.isPinned ? "Unpin" : "Pin"}>
                  <Button
                    icon={<PushpinOutlined />}
                    type={note.isPinned ? "primary" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePin();
                    }}
                    className={`text-lg ${
                      theme === "dark" ? "text-gray-200" : "text-gray-600"
                    }`}
                  />
                </Tooltip>
                {note.lockFeatureEnabled && (
                  <Tooltip
                    title={
                      note.lockStatus?.isLocked ? "Unlock Note" : "Lock Note"
                    }
                  >
                    <Button
                      className={`rounded-full ${
                        theme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                      } cursor-pointer text-blue-400`}
                      onClick={handleLockClick}
                      icon={<UnlockOutlined />}
                    />
                  </Tooltip>
                )}
                <Tooltip title="Invite">
                  <Button
                    icon={<AiOutlineUsergroupAdd />}
                    className={`text-lg ${
                      theme === "dark" ? "text-gray-200" : "text-gray-600"
                    }`}
                  />
                </Tooltip>

                <Tooltip title="Delete">
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => setConfirmDelete(true)}
                  />
                </Tooltip>

                <Tooltip title="More">
                  <Dropdown
                    menu={menu}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <div
                      className={`p-1 rounded-full ${
                        theme === "dark"
                          ? "hover:bg-gray-700 text-white"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EllipsisOutlined className="text-lg" />
                    </div>
                  </Dropdown>
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
            className={`font-medium bg-transparent border-none focus:outline-none w-full ${
              isDetailView ? "text-2xl" : "text-xl"
            } ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
            placeholder="Title"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          />
          <div
            className={`text-sm mt-1 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {note.updatedAt && note.updatedAt !== note.createdAt ? (
              <>Updated: {formatDate(note.updatedAt)}</>
            ) : (
              <>Created: {formatDate(note.createdAt)}</>
            )}
          </div>
        </div>
        {!isDetailView && (
          <div className="flex items-center gap-2 relative z-10">
            <Tooltip title={note.isPinned ? "Unpin" : "Pin"}>
              <div
                className={`p-1 rounded-full ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } cursor-pointer ${
                  note.isPinned
                    ? "text-blue-400"
                    : theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePin();
                }}
              >
                <PushpinOutlined className="text-lg" />
              </div>
            </Tooltip>
            {note.lockFeatureEnabled && (
              <Tooltip
                title={note.lockStatus?.isLocked ? "Unlock Note" : "Lock Note"}
              >
                <div
                  className={`p-1 rounded-full ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } cursor-pointer text-blue-400`}
                  onClick={handleLockClick}
                >
                  <UnlockOutlined className="text-lg" />
                </div>
              </Tooltip>
            )}
            <Tooltip title="View Details">
              <div
                className={`p-1 rounded-full ${
                  theme === "dark"
                    ? "hover:bg-gray-700 text-white"
                    : "hover:bg-gray-100"
                } cursor-pointer `}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/note/${note.id}`);
                }}
              >
                <ExpandOutlined className="text-lg" />
              </div>
            </Tooltip>
            <Tooltip title="More">
              <Dropdown menu={menu} trigger={["click"]} placement="bottomRight">
                <div
                  className={`p-1 rounded-full ${
                    theme === "dark"
                      ? "hover:bg-gray-700 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <EllipsisOutlined className="text-lg" />
                </div>
              </Dropdown>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );
};

export default NoteHeader;
