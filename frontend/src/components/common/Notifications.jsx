import { Button, Menu, Tag } from "antd";
import { MdNotifications } from "react-icons/md";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserAddOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

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

// const demoNotifications = [
//   {
//     id: 1,
//     type: "activation-suggestion",
//     title: "Activate your account",
//     message: "Please verify your account.",
//     status: "info",
//     timestamp: "2025-05-10T10:00:00Z",
//   },
//   {
//     id: 2,
//     type: "activation-success",
//     title: "Account Activated",
//     message: "Your account has been successfully activated!",
//     status: "success",
//     timestamp: "2025-05-10T10:05:00Z",
//   },
//   {
//     id: 3,
//     type: "invitation-pending",
//     title: "Invitation Sent",
//     message: "Invitation sent to Jane Doe to collaborate on 'Project Plan'.",
//     status: "warning",
//     timestamp: "2025-05-10T10:10:00Z",
//   },
//   {
//     id: 4,
//     type: "invitation-success",
//     title: "Invitation Accepted",
//     message: "Jane Doe accepted your invitation to collaborate.",
//     status: "success",
//     timestamp: "2025-05-10T10:15:00Z",
//   },
//   {
//     id: 5,
//     type: "invitation-failed",
//     title: "Invitation Rejected",
//     message: "John Smith rejected your invitation to collaborate.",
//     status: "error",
//     timestamp: "2025-05-10T10:20:00Z",
//   },
//   {
//     id: 6,
//     type: "invitation-accept",
//     title: "Invitation Accepted",
//     message: "You accepted an invitation from Alice to collaborate.",
//     status: "success",
//     timestamp: "2025-05-10T10:25:00Z",
//   },
//   {
//     id: 7,
//     type: "invitation-decline",
//     title: "Invitation Declined",
//     message: "You declined an invitation from Bob to collaborate.",
//     status: "error",
//     timestamp: "2025-05-10T10:30:00Z",
//   },
// ];

const Notifications = ({ notifications = [], max = 3, onShowMore }) => {
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
      className="w-80"
      style={{ maxHeight: 400, overflowY: "auto", overflowX: "hidden" }}
    >
      {notifications.length === 0 ? (
        <Menu.Item disabled>No notifications</Menu.Item>
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
                  <div className="font-semibold text-gray-800 text-sm mb-1">
                    {n.title}
                  </div>
                  <div className="text-xs text-gray-500 mb-1 whitespace-normal break-words">
                    {n.message}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
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
                className="text-blue-500 hover:underline text-sm"
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
