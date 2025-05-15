import { useState } from "react";
import { Tooltip, Button, Dropdown } from "antd";
import {
  DownOutlined,
  RightOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useLabel } from "../../contexts/LabelsContext";
import { useTheme } from "../../contexts/ThemeContext";
import LabelCreate from "./LabelCreate";
import LabelEdit from "./LabelEdit";
import LabelDelete from "./LabelDelete";

const LabelManagement = ({ isCollapsed, isMobile, setCollapsed, navigate }) => {
  const { theme } = useTheme();
  const {
    selectedLabel,
    setSelectedLabel,
    labelsCollapsed,
    toggleLabelsCollapsed,
    availableLabels,
    addNewLabel,
    editLabel,
    deleteLabel,
  } = useLabel();

  const [isNewLabelModalVisible, setIsNewLabelModalVisible] = useState(false);
  const [isEditLabelModalVisible, setIsEditLabelModalVisible] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [isDeleteLabelModalVisible, setIsDeleteLabelModalVisible] =
    useState(false);
  const [deletingLabelName, setDeletingLabelName] = useState(null);

  const handleDeleteLabel = (labelName) => {
    setDeletingLabelName(labelName);
    setIsDeleteLabelModalVisible(true);
  };

  const openEditLabelModal = (label) => {
    setEditingLabel(label);
    setIsEditLabelModalVisible(true);
  };

  const getMenuItems = (label) => [
    {
      key: "edit",
      label: "Edit Label",
      icon: <EditOutlined />,
      onClick: () => {
        openEditLabelModal(label);
      },
    },
    {
      key: "delete",
      label: "Delete Label",
      icon: <DeleteOutlined />,
      onClick: () => {
        handleDeleteLabel(label.name);
      },
    },
  ];

  return (
    <>
      {/* Labels */}
      <div className="px-3">
        {!isCollapsed && (
          <div
            className="flex items-center justify-between px-2 mb-2 cursor-pointer"
            onClick={toggleLabelsCollapsed}
          >
            <h2
              className={`text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Labels
            </h2>
            <Button
              type="text"
              icon={
                labelsCollapsed ? (
                  <RightOutlined className="text-sm" />
                ) : (
                  <DownOutlined className="text-sm" />
                )
              }
              size="small"
              className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
            />
          </div>
        )}

        {(!labelsCollapsed || isCollapsed) && (
          <div
            className={`flex  ${
              isCollapsed ? "flex-col items-center" : "flex-col"
            } gap-1`}
          >
            {availableLabels.map((label) => (
              <Tooltip
                key={label.name}
                title={isCollapsed ? label.name : ""}
                placement="right"
              >
                <div
                  className={`flex items-center justify-between px-2 py-2 rounded-md cursor-pointer ${
                    selectedLabel === label.name
                      ? theme === "dark"
                        ? "bg-blue-900/50 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                      : theme === "dark"
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedLabel(label.name);
                    navigate("/");
                    if (isMobile) {
                      setCollapsed?.(true);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: label.color }}
                    ></div>
                    {!isCollapsed && (
                      <span className="truncate max-w-[140px]">
                        {label.name}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center gap-1">
                      <Tooltip title="More">
                        <Dropdown
                          menu={{ items: getMenuItems(label) }}
                          trigger={["click"]}
                          placement="bottomRight"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            type="text"
                            icon={<EllipsisOutlined />}
                            size="small"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="More options"
                            className={
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }
                          />
                        </Dropdown>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </Tooltip>
            ))}

            {!isCollapsed && (
              <div
                className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer mt-1 ${
                  theme === "dark"
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
                onClick={() => setIsNewLabelModalVisible(true)}
              >
                <PlusOutlined className="text-xs" />
                <span>New Label</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Label Modal */}
      <LabelCreate
        isNewLabelModalVisible={isNewLabelModalVisible}
        setIsNewLabelModalVisible={setIsNewLabelModalVisible}
        addNewLabel={addNewLabel}
      />

      {/* Edit Label Modal */}
      <LabelEdit
        isEditLabelModalVisible={isEditLabelModalVisible}
        setIsEditLabelModalVisible={setIsEditLabelModalVisible}
        editingLabel={editingLabel}
        editLabel={editLabel}
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
      />

      {/* Delete Label Modal */}
      <LabelDelete
        isDeleteLabelModalVisible={isDeleteLabelModalVisible}
        setIsDeleteLabelModalVisible={setIsDeleteLabelModalVisible}
        deletingLabelName={deletingLabelName}
        setDeletingLabelName={setDeletingLabelName}
        deleteLabel={deleteLabel}
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
      />
    </>
  );
};

export default LabelManagement;
