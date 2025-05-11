import { useState } from "react";
import { Input, Select, Button, Badge, Dropdown } from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  SearchOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { MdNotifications } from "react-icons/md";
import Notifications from "./Notifications";
import notificationsData from "../../mock-data/notifications";

const { Option } = Select;

const FunctionBar = ({ onSearch, onSort, onViewModeChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("manual");
  const [viewMode, setViewMode] = useState("grid");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const notifications = notificationsData;
  const unreadCount = notifications.length;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSort?.(value);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    onViewModeChange?.(mode);
  };

  const handleShowMore = (e) => {
    e.stopPropagation();
    setShowAllNotifications(true);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
      <Input
        prefix={<SearchOutlined className="text-gray-400 text-lg" />}
        placeholder="Search notes..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full md:w-64 text-base"
        size="large"
      />
      <div className="flex gap-2 w-full md:w-auto">
        <Select
          value={sortBy}
          onChange={handleSortChange}
          suffixIcon={<SortAscendingOutlined className="text-lg" />}
          className="w-full md:w-32 text-base"
          size="large"
        >
          <Option value="manual">Manual</Option>
          <Option value="newest">Newest</Option>
          <Option value="oldest">Oldest</Option>
          <Option value="title">Title</Option>
        </Select>
        <div className="flex gap-1 border border-gray-200 rounded-md">
          <Button
            icon={<AppstoreOutlined />}
            onClick={() => handleViewModeChange("grid")}
            type={viewMode === "grid" ? "primary" : "text"}
            style={{
              backgroundColor: viewMode === "grid" ? "#e6f7ff" : "",
              borderColor: viewMode === "grid" ? "#e6f7ff" : "",
              color: viewMode === "grid" ? "#1890ff" : "",
            }}
            size="large"
          />
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => handleViewModeChange("list")}
            type={viewMode === "list" ? "primary" : "text"}
            style={{
              backgroundColor: viewMode === "list" ? "#e6f7ff" : "",
              borderColor: viewMode === "list" ? "#e6f7ff" : "",
              color: viewMode === "list" ? "#1890ff" : "",
            }}
            size="large"
          />
        </div>
        <Dropdown
          dropdownRender={() => (
            <Notifications
              notifications={notifications}
              max={showAllNotifications ? notifications.length : 3}
              onShowMore={handleShowMore}
            />
          )}
          trigger={["click"]}
          open={notificationVisible}
          onOpenChange={(visible) => {
            setNotificationVisible(visible);
            if (!visible) setShowAllNotifications(false);
          }}
          placement="bottomRight"
        >
          <Badge count={unreadCount} offset={[-2, 2]}>
            <Button
              icon={<MdNotifications />}
              size="large"
              className="hover:bg-[#e6f7ff]"
            />
          </Badge>
        </Dropdown>
      </div>
    </div>
  );
};

export default FunctionBar;
