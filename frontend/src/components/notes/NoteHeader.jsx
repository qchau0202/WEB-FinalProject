import {
  ArrowLeftOutlined,
  PushpinOutlined,
  DeleteOutlined,
  ExpandOutlined,
  EllipsisOutlined,
  LockOutlined,
  UnlockOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { FaUserGroup } from "react-icons/fa6";
import { CgSpinner } from "react-icons/cg";
import { Button, Dropdown, Tooltip, Spin } from "antd";
import { useNote } from "../../contexts/NotesContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useRef, useState, useEffect } from "react";
import { noteService } from "../../services/noteService";
import NoteInviteModal from "./NoteInviteModal";
import NoteCollaboratorsModal from "./NoteCollaboratorsModal";

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
    setLockAction,
    onLockStateChange,
  } = useNote();
  const { theme, fontSize, getTitleFontSizeClass, themeClasses } = useTheme();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);

  const titleFontSizeClass = getTitleFontSizeClass(fontSize);

  // Saving state for visual feedback
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const saveTimeout = useRef();

  // Listen for note changes and show saving feedback
  useEffect(() => {
    if (note._isSaving) {
      setIsSaving(true);
      setJustSaved(false);
    } else if (isSaving) {
      setIsSaving(false);
      setJustSaved(true);
      clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => setJustSaved(false), 1200);
    }
  }, [note._isSaving]);

  // useEffect(() => {
  //   console.log("Note data:", note);
  //   console.log("Collaborators:", JSON.stringify(note.collaborators, null, 2));
  // }, [note]);

  const handleEnableLock = async (e) => {
    e.domEvent?.stopPropagation();
    try {
      const response = await noteService.enableLockFeature(note.uuid);
      // message.success("Lock feature enabled successfully");
      onLockStateChange?.(response.note);
    } catch (error) {
      console.error("Failed to enable lock feature:", error);
      // message.error("Failed to enable lock feature");
    }
  };

  const handleLockClick = (e) => {
    e.stopPropagation();
    if (note.lock_feature_enabled) {
      if (!note.is_locked) {
        // If password is already set, lock immediately
        if (note.password) {
          noteService.lockNote(note.uuid, note.password).then((response) => {
            onLockStateChange?.(response.note);
          });
        } else {
          // Show modal to set password
          setLockAction("enable");
          setShowLockModal(true);
        }
      } else {
        // Show modal to unlock
        setLockAction("unlock");
        setShowLockModal(true);
      }
    }
  };

  const handleDisableLock = async (e) => {
    e.domEvent?.stopPropagation();
    try {
      if (!note.password) {
        // No password set, disable lock feature immediately
        const response = await noteService.disableLockFeature(note.uuid);
        // message.success("Lock feature disabled successfully");
        onLockStateChange?.(response.note);
      } else {
        // Password is set, show modal to confirm password
        setLockAction("disable");
        setShowLockModal(true);
      }
    } catch (error) {
      console.error("Failed to disable lock feature:", error);
      // message.error("Failed to disable lock feature");
    }
  };

  const menu = {
    items: isDetailView
      ? [
          {
            key: "invite",
            label: "Invite Collaborator",
            onClick: () => setShowInviteModal(true),
          },
          {
            key: "lock",
            label: note.lock_feature_enabled
              ? "Disable Lock Feature"
              : "Enable Lock Feature",
            onClick: note.lock_feature_enabled
              ? handleDisableLock
              : handleEnableLock,
          },
        ]
      : [
          {
            key: "invite",
            label: "Invite Collaborator",
            onClick: () => setShowInviteModal(true),
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
            label: note.lock_feature_enabled
              ? "Disable Lock Feature"
              : "Enable Lock Feature",
            onClick: note.lock_feature_enabled
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
                  icon={
                    <div className={themeClasses.font[fontSize]}>
                      <ArrowLeftOutlined />
                    </div>
                  }
                  type="text"
                  onClick={() => navigate("/")}
                  className={`text-lg hidden md:inline-flex ${
                    theme === "dark" ? "text-gray-200" : "text-gray-600"
                  } ${themeClasses.font[fontSize]}`}
                />
                <div
                  className={`text-base ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  } flex items-center hidden md:flex`}
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
                <Tooltip
                  title={note.is_pinned ? "Unpin" : "Pin"}
                  className={themeClasses.font[fontSize]}
                >
                  <Button
                    icon={
                      <div className={themeClasses.font[fontSize]}>
                        <PushpinOutlined />
                      </div>
                    }
                    type={note.is_pinned ? "primary" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePin();
                    }}
                    className={`text-lg ${
                      theme === "dark" ? "text-gray-200" : "text-gray-600"
                    } ${themeClasses.font[fontSize]}`}
                  />
                </Tooltip>
                {note.lock_feature_enabled && (
                  <Tooltip
                    title={note.is_locked ? "Unlock Note" : "Lock Note"}
                    className={themeClasses.font[fontSize]}
                  >
                    <Button
                      className={`rounded-full ${
                        theme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                      } cursor-pointer text-blue-400 ${
                        themeClasses.font[fontSize]
                      }`}
                      onClick={handleLockClick}
                      icon={
                        <div className={themeClasses.font[fontSize]}>
                          {note.is_locked ? (
                            <UnlockOutlined />
                          ) : (
                            <LockOutlined />
                          )}
                        </div>
                      }
                    />
                  </Tooltip>
                )}
                {note.collaborators && note.collaborators.length > 0 && (
                  <Tooltip
                    title="Collaborators"
                    className={themeClasses.font[fontSize]}
                  >
                    <Button
                      icon={
                        <div className={themeClasses.font[fontSize]}>
                          <FaUserGroup />
                        </div>
                      }
                      onClick={() => setShowCollaboratorsModal(true)}
                      className={`text-lg ${
                        theme === "dark" ? "text-gray-200" : "text-gray-600"
                      } ${themeClasses.font[fontSize]}`}
                    />
                  </Tooltip>
                )}

                <Tooltip title="Delete" className={themeClasses.font[fontSize]}>
                  <Button
                    icon={
                      <div className={themeClasses.font[fontSize]}>
                        <DeleteOutlined />
                      </div>
                    }
                    danger
                    onClick={() => setConfirmDelete(true)}
                  />
                </Tooltip>

                <Tooltip title="More" className={themeClasses.font[fontSize]}>
                  <Dropdown
                    menu={{ ...menu, className: themeClasses.font[fontSize] }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <div
                      className={`p-1 rounded-full ${
                        theme === "dark"
                          ? "hover:bg-gray-700 text-white"
                          : "hover:bg-gray-100"
                      } ${themeClasses.font[fontSize]}`}
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
            className={`font-medium bg-transparent border-none focus:outline-none w-full ${titleFontSizeClass} ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
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
          <div
            className={`text-sm mt-1 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } flex items-center gap-2`}
          >
            {note.updated_at && note.updated_at !== note.created_at ? (
              <>
                Updated: {formatDate(note.updated_at)}
                {isSaving ? (
                  <Spin indicator={<CgSpinner spin="true" />} size="small" />
                ) : justSaved ? (
                  <div className="text-green-500">
                    <CheckCircleFilled />
                  </div>
                ) : null}
              </>
            ) : (
              <>
                Created: {formatDate(note.created_at)}
                {isSaving ? (
                  <Spin indicator={<CgSpinner spin="true" />} size="small" />
                ) : justSaved ? (
                  <div className="text-green-500">
                    <CheckCircleFilled />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
        {!isDetailView && (
          <div className="flex items-center gap-2 relative z-10">
            <Tooltip
              title={note.is_pinned ? "Unpin" : "Pin"}
              className={themeClasses.font[fontSize]}
            >
              <div
                className={`p-1 rounded-full ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } cursor-pointer ${
                  note.is_pinned
                    ? "text-blue-400"
                    : theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-500"
                } ${themeClasses.font[fontSize]}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePin();
                }}
              >
                <div className={themeClasses.font[fontSize]}>
                  <PushpinOutlined />
                </div>
              </div>
            </Tooltip>
            {note.collaborators && note.collaborators.length > 0 && (
              <Tooltip
                title="Collaborators"
                className={themeClasses.font[fontSize]}
              >
                <div
                  className={`p-1 rounded-full ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } cursor-pointer text-blue-400 ${
                    themeClasses.font[fontSize]
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCollaboratorsModal(true);
                  }}
                >
                  <FaUserGroup />
                </div>
              </Tooltip>
            )}
            {note.lock_feature_enabled && (
              <Tooltip
                title={note.is_locked ? "Unlock Note" : "Lock Note"}
                className={themeClasses.font[fontSize]}
              >
                <div
                  className={`p-1 rounded-full ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } cursor-pointer text-blue-400 ${
                    themeClasses.font[fontSize]
                  }`}
                  onClick={handleLockClick}
                >
                  <div className={themeClasses.font[fontSize]}>
                    {note.is_locked ? <LockOutlined /> : <UnlockOutlined />}
                  </div>
                </div>
              </Tooltip>
            )}
            <Tooltip
              title="View Details"
              className={themeClasses.font[fontSize]}
            >
              <div
                className={`p-1 rounded-full ${
                  theme === "dark"
                    ? "hover:bg-gray-700 text-white"
                    : "hover:bg-gray-100"
                } cursor-pointer ${themeClasses.font[fontSize]}`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/note/${note.uuid}`);
                }}
              >
                <ExpandOutlined className="text-lg" />
              </div>
            </Tooltip>
            <Tooltip title="More" className={themeClasses.font[fontSize]}>
              <Dropdown menu={menu} trigger={["click"]} placement="bottomRight">
                <div
                  className={`p-1 rounded-full ${
                    theme === "dark"
                      ? "hover:bg-gray-700 text-white"
                      : "hover:bg-gray-100"
                  } ${themeClasses.font[fontSize]}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <EllipsisOutlined className="text-lg" />
                </div>
              </Dropdown>
            </Tooltip>
          </div>
        )}
      </div>

      <NoteInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        noteUuid={note.uuid}
        collaborators={note.collaborators}
      />
      <NoteCollaboratorsModal
        isOpen={showCollaboratorsModal}
        onClose={() => setShowCollaboratorsModal(false)}
        collaborators={note.collaborators}
        noteUuid={note.uuid}
        noteOwnerUuid={note.user_id}
      />
    </>
  );
};

export default NoteHeader;
