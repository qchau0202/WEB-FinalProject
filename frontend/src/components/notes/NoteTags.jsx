import { PlusOutlined, TagOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Tooltip, Badge } from "antd";

const NoteTags = ({ tags, onAddTag, onClick }) => {
  const availableTags = [
    { name: "Urgent", color: "bg-red-400" },
    { name: "Work", color: "bg-yellow-400" },
    { name: "Study", color: "bg-blue-400" },
    { name: "Exam", color: "bg-purple-400" },
    { name: "Personal", color: "bg-green-400" },
    { name: "Ideas", color: "bg-indigo-400" },
  ];

  // Find tags that haven't been added yet
  const remainingTags = availableTags.filter(
    (availTag) => !tags.some((tag) => tag.name === availTag.name)
  );

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
    <div className="flex items-center gap-2" onClick={onClick}>
      {tags.length === 0 ? (
        <div className="text-sm text-gray-400 flex items-center">
          <TagOutlined className="mr-1 text-lg" />{" "}
          <span className="text-base">No tags</span>
        </div>
      ) : (
        <>
          {tags.slice(0, 3).map((tag, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded-full text-sm text-white ${tag.color} font-medium`}
            >
              {tag.name}
            </div>
          ))}
          {tags.length > 3 && (
            <Tooltip
              title={
                <div className="flex flex-wrap gap-2">
                  {tags.slice(3).map((tag, index) => (
                    <div
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm text-white ${tag.color}`}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              }
            >
              <Badge
                count={`+${tags.length - 3}`}
                size="small"
                className="cursor-pointer text-xs"
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          )}
        </>
      )}

      {remainingTags.length > 0 && (
        <Tooltip title="Add tag">
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <div
              className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
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