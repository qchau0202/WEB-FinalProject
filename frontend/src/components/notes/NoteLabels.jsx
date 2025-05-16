import { PlusOutlined, TagOutlined, CloseOutlined } from "@ant-design/icons";
import { Dropdown, Tooltip } from "antd";
import { useLabel } from "../../contexts/LabelsContext";
import { useNote } from "../../contexts/NotesContext";
import { useTheme } from "../../contexts/ThemeContext";

const LABEL_MAX_WIDTH = 100; // px, max width for each label
const CONTAINER_MAX_WIDTH = 220; // px, total width for labels + badge

const NoteLabels = ({ onClick }) => {
  const {
    labels: noteLabels,
    isDetailView,
    handleAddLabel,
    handleRemoveLabel,
  } = useNote();
  const { availableLabels } = useLabel();
  const { theme, fontSize, themeClasses } = useTheme();

  const customColor = "#ffffff";

  // Find labels that haven't been added yet
  const remainingLabels = availableLabels.filter(
    (availLabel) => !noteLabels.some((label) => label.name === availLabel.name)
  );

  let visibleLabels = [];
  let hiddenLabels = [];
  let badgeNeeded = false;
  const plusWidth = 36;
  const badgeWidth = 36;
  const maxLabels = isDetailView ? 6 : 2;

  if (isDetailView) {
    visibleLabels = noteLabels.slice(0, 6);
    hiddenLabels = noteLabels.slice(6);
    badgeNeeded = hiddenLabels.length > 0;
  } else {
    let usedWidth = 0;
    for (let i = 0; i < noteLabels.length; i++) {
      if (visibleLabels.length >= maxLabels) break;
      if (
        usedWidth +
          LABEL_MAX_WIDTH +
          plusWidth +
          (badgeNeeded ? badgeWidth : 0) >
        CONTAINER_MAX_WIDTH
      ) {
        badgeNeeded = true;
        break;
      }
      usedWidth += LABEL_MAX_WIDTH;
      visibleLabels.push(noteLabels[i]);
    }
    if (visibleLabels.length < noteLabels.length) {
      hiddenLabels = noteLabels.slice(visibleLabels.length);
      badgeNeeded = true;
      if (
        usedWidth + badgeWidth + plusWidth > CONTAINER_MAX_WIDTH &&
        visibleLabels.length > 0
      ) {
        hiddenLabels.unshift(visibleLabels.pop());
      }
    }
  }

  const menu = {
    items:
      remainingLabels.length > 0
        ? remainingLabels.map((label) => ({
            key: label.id,
            label: (
              <div className="flex items-center">
                <span
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: label.color }}
                />
                <span
                  className={`${
                    theme === "dark" ? "text-gray-100" : "text-gray-800"
                  } ${themeClasses.font[fontSize]}`}
                >
                  {label.name}
                </span>
              </div>
            ),
            onClick: (e) => {
              e.domEvent.stopPropagation();
              handleAddLabel(label);
            },
          }))
        : [
            {
              key: "no-labels",
              label: (
                <span
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }
                >
                  All labels already added
                </span>
              ),
              disabled: true,
            },
          ],
  };

  const addLabelButton = (
    <div
      className={`p-1 rounded-full flex-shrink-0 cursor-pointer ${
        theme === "dark" ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 "
      }`}
      onClick={(e) => e.stopPropagation()}
      style={{
        width: plusWidth,
        height: plusWidth,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PlusOutlined />
    </div>
  );

  return (
    <div
      className="flex items-center gap-2 min-w-0"
      onClick={onClick}
      style={isDetailView ? {} : { maxWidth: CONTAINER_MAX_WIDTH + plusWidth }}
    >
      {noteLabels.length === 0 ? (
        <div
          className={`text-sm flex items-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-400"
          }`}
        >
          <TagOutlined className="mr-1 text-lg" />
          <span
            className={`text-base ${
              theme === "dark" ? "text-gray-400" : "text-gray-400"
            }`}
          >
            No labels
          </span>
        </div>
      ) : (
        <>
          {visibleLabels.map((label, index) => (
            <div
              key={label.id || index}
              className={`px-3 py-1 rounded-full font-medium flex-shrink-0 flex items-center ${
                theme === "dark" ? "text-gray-100" : "text-white"
              } ${themeClasses.font[fontSize]}`}
              style={{
                overflow: "hidden",
                minWidth: 24,
                maxWidth: 120,
                backgroundColor: label.color,
              }}
            >
              <span
                style={{ flex: 1, minWidth: 0 }}
                className="overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {label.name}
              </span>
              <CloseOutlined
                className={`ml-2 cursor-pointer leading-none align-middle flex items-center justify-center ${
                  theme === "dark" ? "hover:text-red-400" : "hover:text-red-700"
                }`}
                style={{
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  height: "1em",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveLabel(label);
                }}
              />
            </div>
          ))}
          {badgeNeeded && (
            <Tooltip
              title={
                <div
                  className={`flex flex-wrap gap-2 ${themeClasses.font[fontSize]}`}
                >
                  {hiddenLabels.map((label, index) => (
                    <div
                      key={label.id || index}
                      className={`px-3 py-1 rounded-full font-medium flex items-center ${
                        theme === "dark" ? "text-gray-100" : "text-white"
                      }`}
                      style={{
                        backgroundColor: label.color,
                      }}
                    >
                      <span style={{ flex: 1 }}>{label.name}</span>
                      <CloseOutlined
                        className={`ml-2 cursor-pointer leading-none align-middle flex items-center justify-center ${
                          theme === "dark"
                            ? "hover:text-red-400"
                            : "hover:text-red-700"
                        }`}
                        style={{
                          fontSize: 16,
                          display: "flex",
                          alignItems: "center",
                          height: "1em",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLabel(label);
                        }}
                      />
                    </div>
                  ))}
                </div>
              }
              color={customColor}
              key={customColor}
            >
              <span
                className={`cursor-pointer rounded-full flex-shrink-0 px-2 py-1 text-sm font-medium border transition-colors ${
                  theme === "dark"
                    ? "border-gray-700 text-blue-300 bg-gray-900 hover:bg-gray-800"
                    : "border-gray-300 text-blue-500 bg-white hover:bg-gray-100"
                }`}
                style={{ display: "inline-flex", alignItems: "center" }}
                onClick={(e) => e.stopPropagation()}
              >
                +{hiddenLabels.length}
              </span>
            </Tooltip>
          )}
        </>
      )}
      {remainingLabels.length > 0 && (
        <Dropdown menu={menu} trigger={["click"]} placement="bottomRight">
          <Tooltip title="Add label" className={themeClasses.font[fontSize]}>
            {addLabelButton}
          </Tooltip>
        </Dropdown>
      )}
    </div>
  );
};

export default NoteLabels;
