import { PlusOutlined, TagOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Tooltip, Badge } from "antd";
const TAG_MAX_WIDTH = 100; // px, max width for each tag
const CONTAINER_MAX_WIDTH = 220; // px, total width for tags + badge

const NoteTags = ({ tags, onAddTag, onClick, isDetailView }) => {
  const availableTags = [
    { name: "Urgent", color: "bg-red-400" },
    { name: "Work", color: "bg-yellow-400" },
    { name: "Study", color: "bg-blue-400" },
    { name: "Exam", color: "bg-purple-400" },
    { name: "Personal", color: "bg-green-400" },
    { name: "Ideas", color: "bg-indigo-400" },
    { name: "N", color: "bg-indigo-400" },
    { name: "J", color: "bg-purple-400" },
  ];

  const customColor = "#ffffff";

  // Find tags that haven't been added yet
  const remainingTags = availableTags.filter(
    (availTag) => !tags.some((tag) => tag.name === availTag.name)
  );

  let visibleTags = [];
  let hiddenTags = [];
  let badgeNeeded = false;
  const plusWidth = 36;
  const badgeWidth = 36;
  const maxTags = isDetailView ? 6 : 2;

  if (isDetailView) {
    visibleTags = tags.slice(0, 6);
    hiddenTags = tags.slice(6);
    badgeNeeded = hiddenTags.length > 0;
  } else {
    let usedWidth = 0;
    for (let i = 0; i < tags.length; i++) {
      if (visibleTags.length >= maxTags) break;
      if (
        usedWidth + TAG_MAX_WIDTH + plusWidth + (badgeNeeded ? badgeWidth : 0) >
        CONTAINER_MAX_WIDTH
      ) {
        badgeNeeded = true;
        break;
      }
      usedWidth += TAG_MAX_WIDTH;
      visibleTags.push(tags[i]);
    }
    if (visibleTags.length < tags.length) {
      hiddenTags = tags.slice(visibleTags.length);
      badgeNeeded = true;
      if (
        usedWidth + badgeWidth + plusWidth > CONTAINER_MAX_WIDTH &&
        visibleTags.length > 0
      ) {
        hiddenTags.unshift(visibleTags.pop());
      }
    }
  }

  const menu = (
    <Menu>
      {remainingTags.length > 0 ? (
        remainingTags.map((tag, index) => (
          <Menu.Item
            key={index}
            onClick={(e) => {
              e.domEvent.stopPropagation();
              onAddTag(tag);
            }}
          >
            <div className="flex items-center">
              <span className={`w-4 h-4 rounded-full ${tag.color} mr-2`}></span>
              <span className="text-base">{tag.name}</span>
            </div>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>
          <span className="text-base">All tags already added</span>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div
      className="flex items-center gap-2 min-w-0"
      onClick={onClick}
      style={isDetailView ? {} : { maxWidth: CONTAINER_MAX_WIDTH + plusWidth }}
    >
      {tags.length === 0 ? (
        <div className="text-sm text-gray-400 flex items-center">
          <TagOutlined className="mr-1 text-lg" />{" "}
          <span className="text-base">No tags</span>
        </div>
      ) : (
        <>
          {visibleTags.map((tag, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded-full text-sm text-white ${tag.color} font-medium flex-shrink-0`}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 24,
                maxWidth: 100,
              }}
            >
              {tag.name}
            </div>
          ))}
          {badgeNeeded && (
            <Tooltip
              title={
                <div className="flex flex-wrap gap-2">
                  {hiddenTags.map((tag, index) => (
                    <div
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm text-white ${tag.color}`}
                    >
                      {tag.name}
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
                +{hiddenTags.length}
              </span>
            </Tooltip>
          )}
        </>
      )}
      {remainingTags.length > 0 && (
        <Tooltip title="Add tag">
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
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
          </Dropdown>
        </Tooltip>
      )}
    </div>
  );
};

export default NoteTags;
