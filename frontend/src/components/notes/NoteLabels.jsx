import { PlusOutlined, TagOutlined } from "@ant-design/icons";
import { Dropdown, Tooltip } from "antd";
import { useLabel } from "../../contexts/LabelsContext";
import { useNote } from "../../contexts/NotesContext";

const LABEL_MAX_WIDTH = 100; // px, max width for each label
const CONTAINER_MAX_WIDTH = 220; // px, total width for labels + badge

const NoteLabels = ({ onClick }) => {
  const { labels: noteLabels, isDetailView, handleAddLabel } = useNote();
  const { availableLabels } = useLabel();

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
        ? remainingLabels.map((label, index) => ({
            key: label.id || index,
            label: (
              <div className="flex items-center">
                <span
                  className={`w-4 h-4 rounded-full mr-2`}
                  style={{ backgroundColor: label.color }}
                ></span>
                <span className="text-base">{label.name}</span>
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
                <span className="text-base">All labels already added</span>
              ),
              disabled: true,
            },
          ],
  };

  const addLabelButton = (
    <div
      className="p-1 rounded-full hover:bg-gray-200 cursor-pointer flex-shrink-0"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: plusWidth,
        height: plusWidth,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PlusOutlined className="text-gray-500 text-base" />
    </div>
  );

  return (
    <div
      className="flex items-center gap-2 min-w-0"
      onClick={onClick}
      style={isDetailView ? {} : { maxWidth: CONTAINER_MAX_WIDTH + plusWidth }}
    >
      {noteLabels.length === 0 ? (
        <div className="text-sm text-gray-400 flex items-center">
          <TagOutlined className="mr-1 text-lg" />{" "}
          <span className="text-base">No labels</span>
        </div>
      ) : (
        <>
          {visibleLabels.map((label, index) => (
            <div
              key={label.id || index}
              className={`px-3 py-1 rounded-full text-sm text-white font-medium flex-shrink-0`}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 24,
                maxWidth: 100,
                backgroundColor: label.color,
              }}
            >
              {label.name}
            </div>
          ))}
          {badgeNeeded && (
            <Tooltip
              title={
                <div className="flex flex-wrap gap-2">
                  {hiddenLabels.map((label, index) => (
                    <div
                      key={label.id || index}
                      className={`px-3 py-1 rounded-full text-sm text-white`}
                      style={{
                        backgroundColor: label.color,
                      }}
                    >
                      {label.name}
                    </div>
                  ))}
                </div>
              }
              color={customColor}
              key={customColor}
            >
              <span
                className="cursor-pointer rounded-full flex-shrink-0 px-2 py-1 text-sm font-medium border border-gray-300 text-blue-500 bg-white transition-colors"
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
          <Tooltip title="Add label">{addLabelButton}</Tooltip>
        </Dropdown>
      )}
    </div>
  );
};

export default NoteLabels;
