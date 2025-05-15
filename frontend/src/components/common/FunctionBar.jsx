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
import { useTheme } from "../../contexts/ThemeContext";

const { Option } = Select;

const FunctionBar = ({ onSearch, onSort, onViewModeChange }) => {
  const { theme } = useTheme();
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
        prefix={
          <SearchOutlined
            className={`text-lg ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          />
        }
        placeholder="Search notes..."
        value={searchQuery}
        onChange={handleSearchChange}
        className={`w-full md:w-64 text-base ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
            : "bg-white border-gray-200 text-gray-800 placeholder-gray-500"
        }`}
        size="large"
      />
      <div className="flex gap-2 w-full md:w-auto">
        <Select
          value={sortBy}
          onChange={handleSortChange}
          suffixIcon={
            <SortAscendingOutlined
              className={`text-lg ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            />
          }
          className={`w-full md:w-32 text-base ${
            theme === "dark"
              ? "text-gray-100"
              : "text-gray-800"
          }`}
          size="large"
        >
          <Option value="manual">Manual</Option>
          <Option value="newest">Newest</Option>
          <Option value="oldest">Oldest</Option>
          <Option value="title">Title</Option>
        </Select>
        <div
          className={`flex gap-1 border rounded-xl ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <Button
            icon={<AppstoreOutlined />}
            onClick={() => handleViewModeChange("grid")}
            type={viewMode === "grid" ? "primary" : "text"}
            style={{
              backgroundColor:
                viewMode === "grid"
                  ? theme === "dark"
                    ? "#1e3a8a"
                    : "#e6f7ff"
                  : "",
              borderColor:
                viewMode === "grid"
                  ? theme === "dark"
                    ? "#1e3a8a"
                    : "#e6f7ff"
                  : "",
              color:
                viewMode === "grid"
                  ? theme === "dark"
                    ? "#60a5fa"
                    : "#1890ff"
                  : theme === "dark"
                  ? "#9ca3af"
                  : "#6b7280",
            }}
            size="large"
          />
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => handleViewModeChange("list")}
            type={viewMode === "list" ? "primary" : "text"}
            style={{
              backgroundColor:
                viewMode === "list"
                  ? theme === "dark"
                    ? "#1e3a8a"
                    : "#e6f7ff"
                  : "",
              borderColor:
                viewMode === "list"
                  ? theme === "dark"
                    ? "#1e3a8a"
                    : "#e6f7ff"
                  : "",
              color:
                viewMode === "list"
                  ? theme === "dark"
                    ? "#60a5fa"
                    : "#1890ff"
                  : theme === "dark"
                  ? "#9ca3af"
                  : "#6b7280",
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
              icon={
                <MdNotifications
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }
                />
              }
              size="large"
              className={`hover:bg-opacity-10 ${
                theme === "dark" ? "hover:bg-blue-400" : "hover:bg-blue-500"
              }`}
            />
          </Badge>
        </Dropdown>
      </div>
    </div>
  );
};

export default FunctionBar;
// import React from "react";
// import { Input, Select, Button, Tooltip } from "antd";
// import {
//   SearchOutlined,
//   AppstoreOutlined,
//   UnorderedListOutlined,
//   BellOutlined,
// } from "@ant-design/icons";
// import Notifications from "./Notifications";

// const { Option } = Select;

// const FunctionBar = ({
//   onSearch,
//   onSort,
//   onViewModeChange,
//   notifications,
//   showAllNotifications,
//   setShowAllNotifications,
//   notificationVisible,
//   setNotificationVisible,
//   handleShowMore,
// }) => {
//   return (
//     <div className="flex flex-col sm:flex-row items-center gap-4">
//       <div className="flex items-center gap-2 w-full sm:w-auto">
//         <Input
//           prefix={<SearchOutlined className="text-gray-400" />}
//           placeholder="Search notes..."
//           onChange={(e) => onSearch(e.target.value)}
//           className="w-full sm:w-64"
//         />
//         <Select
//           defaultValue="manual"
//           onChange={onSort}
//           className="w-full sm:w-40"
//         >
//           <Option value="manual">Manual</Option>
//           <Option value="title">Title</Option>
//           <Option value="date">Date</Option>
//         </Select>
//       </div>
//       <div className="flex items-center gap-2">
//         <Tooltip title="Grid View">
//           <Button
//             icon={<AppstoreOutlined />}
//             onClick={() => onViewModeChange("grid")}
//           />
//         </Tooltip>
//         <Tooltip title="List View">
//           <Button
//             icon={<UnorderedListOutlined />}
//             onClick={() => onViewModeChange("list")}
//           />
//         </Tooltip>
//         <div className="relative">
//           <Tooltip title="Notifications">
//             <Button
//               icon={<BellOutlined />}
//               onClick={() => setNotificationVisible(!notificationVisible)}
//             />
//           </Tooltip>
//           {notificationVisible && (
//             <Notifications
//               notifications={notifications}
//               showAll={showAllNotifications}
//               onShowMore={handleShowMore}
//               onClose={() => setNotificationVisible(false)}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FunctionBar;
