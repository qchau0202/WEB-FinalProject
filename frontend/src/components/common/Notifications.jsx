import { Button, Menu, Tag } from "antd";
import { MdNotifications } from "react-icons/md";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserAddOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";

const notificationColors = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
};

const notificationIcons = {
  info: <MdNotifications className="text-blue-500 text-lg" />,
  success: <CheckCircleOutlined className="text-green-500 text-lg" />,
  warning: <ClockCircleOutlined className="text-yellow-500 text-lg" />,
  error: <CloseCircleOutlined className="text-red-500 text-lg" />,
  invite: <UserAddOutlined className="text-blue-500 text-lg" />,
  delete: <CloseCircleOutlined className="text-red-500 text-lg" />,
};

const Notifications = ({ notifications = [], max = 3, onShowMore }) => {
  const { theme } = useTheme();
  const showMore = notifications.length > max;
  const visibleNotifications = notifications.slice(0, max);

  const handleAccept = (id) => {
    // Placeholder for accept logic
    console.log("Accepted invitation for notification id:", id);
  };
  const handleDecline = (id) => {
    // Placeholder for decline logic
    console.log("Declined invitation for notification id:", id);
  };

  return (
    <Menu
      className={`w-80 ${theme === "dark" ? "bg-gray-800" : "bg-white"} ${
        theme === "dark"
          ? "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full"
          : "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
      }`}
      style={{ maxHeight: 400, overflowY: "auto", overflowX: "hidden" }}
    >
      {notifications.length === 0 ? (
        <Menu.Item
          disabled
          className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
        >
          No notifications
        </Menu.Item>
      ) : (
        <>
          {visibleNotifications.map((n) => (
            <Menu.Item key={n.id} className="!p-3 !min-h-0">
              <div className="flex items-start gap-3">
                <span className={`mt-1 ${notificationColors[n.status]}`}>
                  {notificationIcons[n.status] ||
                    notificationIcons[n.type] ||
                    notificationIcons.info}
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-semibold text-sm mb-1 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {n.title}
                  </div>
                  <div
                    className={`text-xs mb-1 whitespace-normal break-words ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {n.message}
                  </div>
                  <div
                    className={`text-xs mb-1 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {n.timestamp && new Date(n.timestamp).toLocaleString()}
                  </div>
                  {/* Invitation-pending actions (incoming/outgoing) */}
                  {n.type === "invitation-pending" &&
                    n.direction === "incoming" && (
                      <div className="flex mt-2 gap-2">
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleAccept(n.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          danger
                          size="small"
                          onClick={() => handleDecline(n.id)}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  {n.type === "invitation-pending" &&
                    n.direction === "outgoing" && (
                      <div className="flex mt-2">
                        <Tag color="gold" className="text-xs px-2 py-0.5">
                          Pending
                        </Tag>
                      </div>
                    )}
                </div>
              </div>
            </Menu.Item>
          ))}
          {showMore && (
            <Menu.Item key="show-more" className="!p-3 !min-h-0 text-center">
              <button
                className={`text-sm hover:underline ${
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-500 hover:text-blue-600"
                }`}
                onClick={onShowMore}
                style={{
                  outline: "none",
                  background: "none",
                  border: 0,
                  cursor: "pointer",
                }}
              >
                Show more
              </button>
            </Menu.Item>
          )}
        </>
      )}
    </Menu>
  );
};

export default Notifications;
// import React from "react";
// import { List, Button, Typography } from "antd";
// import { CloseOutlined } from "@ant-design/icons";

// const { Text } = Typography;

// const Notifications = ({ notifications, showAll, onShowMore, onClose }) => {
//   const displayNotifications = showAll
//     ? notifications
//     : notifications.slice(0, 5);

//   return (
//     <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
//       <div className="p-4 border-b flex justify-between items-center">
//         <Text strong>Notifications</Text>
//         <Button
//           type="text"
//           icon={<CloseOutlined />}
//           onClick={onClose}
//           className="hover:bg-gray-100"
//         />
//       </div>
//       <List
//         dataSource={displayNotifications}
//         renderItem={(notification) => (
//           <List.Item className="px-4 py-2 hover:bg-gray-50">
//             <div className="w-full">
//               <Text>{notification.message}</Text>
//               <Text type="secondary" className="block text-xs">
//                 {new Date(notification.timestamp).toLocaleString()}
//               </Text>
//             </div>
//           </List.Item>
//         )}
//       />
//       {notifications.length > 5 && !showAll && (
//         <div className="p-2 border-t text-center">
//           <Button type="link" onClick={onShowMore}>
//             Show More
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;
