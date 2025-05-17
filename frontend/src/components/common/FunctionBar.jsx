import { useState, useEffect } from "react";
import { Input, Select, Button, Badge, Dropdown, Popover } from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { MdNotifications } from "react-icons/md";
import Notifications from "./Notifications";
import { useTheme } from "../../contexts/ThemeContext";
import { notificationService } from "../../services/notificationService";

const { Option } = Select;

const FunctionBar = ({ onSearch, onSort, onViewModeChange }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("manual");
  const [viewMode, setViewMode] = useState("grid");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationService.getNotifications();
        const notifications = Array.isArray(response.data) ? response.data : [];
        const unread = notifications.filter((n) => !n.read_at).length;
        setUnreadCount(unread);
      } catch {
        setUnreadCount(0);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Mobile: Two rows - controls on top, search bar below */}
      <div className="md:hidden w-full flex flex-col gap-2">
        <div className="flex justify-between items-center gap-2 w-full">
          <Select
            value={sortBy}
            onChange={handleSortChange}
            className="w-40 rounded-lg"
            size="large"
          >
            <Option value="manual">Manual</Option>
            <Option value="title">Title</Option>
            <Option value="created_at">Created</Option>
            <Option value="updated_at">Updated</Option>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              icon={<AppstoreOutlined />}
              type={viewMode === "grid" ? "primary" : "default"}
              size="large"
              onClick={() => handleViewModeChange("grid")}
            />
            <Button
              icon={<UnorderedListOutlined />}
              type={viewMode === "list" ? "primary" : "default"}
              size="large"
              onClick={() => handleViewModeChange("list")}
            />
            <Popover
              content={
                <Notifications
                  max={showAllNotifications ? undefined : 3}
                  onShowMore={handleShowMore}
                />
              }
              trigger="click"
              open={notificationVisible}
              onOpenChange={(visible) => {
                setNotificationVisible(visible);
                if (!visible) setShowAllNotifications(false);
              }}
              placement="bottomRight"
            >
              <Button
                icon={
                  <Badge count={unreadCount} size="small" offset={[2, -2]}>
                    <MdNotifications
                      className={
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }
                    />
                  </Badge>
                }
                size="large"
              />
            </Popover>
          </div>
        </div>
        <Input
          placeholder="Search notes..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={handleSearchChange}
          className={`w-full rounded-full py-2 px-4 text-base shadow-sm ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
          size="large"
        />
      </div>
      {/* Desktop: Full FunctionBar */}
      <div className="hidden md:flex items-center gap-4 w-full">
        <Input
          placeholder="Search notes..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={handleSearchChange}
          className={`rounded-lg ${
            theme === "dark" ? "bg-gray-700 border-gray-600" : ""
          }`}
          size="large"
        />
        <Select
          value={sortBy}
          onChange={handleSortChange}
          className={`rounded-lg ${theme === "dark" ? "bg-gray-700" : ""}`}
          size="large"
        >
          <Option value="manual" size="large">
            Manual
          </Option>
          <Option value="title" size="large">
            Title
          </Option>
          <Option value="created_at" size="large">
            Created Date
          </Option>
          <Option value="updated_at" size="large">
            Updated Date
          </Option>
        </Select>
        <div className="flex items-center gap-2">
          <Button
            icon={<AppstoreOutlined />}
            type={viewMode === "grid" ? "primary" : "default"}
            onClick={() => handleViewModeChange("grid")}
            size="large"
          />
          <Button
            icon={<UnorderedListOutlined />}
            type={viewMode === "list" ? "primary" : "default"}
            onClick={() => handleViewModeChange("list")}
            size="large"
          />
        </div>
        <div>
          <Popover
            content={
              <Notifications
                max={showAllNotifications ? undefined : 3}
                onShowMore={handleShowMore}
              />
            }
            trigger="click"
            open={notificationVisible}
            onOpenChange={(visible) => {
              setNotificationVisible(visible);
              if (!visible) setShowAllNotifications(false);
            }}
            placement="bottomRight"
          >
            <Button
              icon={
                <Badge count={unreadCount} size="small" offset={[2, -2]}>
                  <MdNotifications
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }
                  />
                </Badge>
              }
              className={`hover:bg-opacity-10 ${
                theme === "dark" ? "hover:bg-blue-400" : "hover:bg-blue-500"
              }`}
              size="large"
            />
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default FunctionBar;
