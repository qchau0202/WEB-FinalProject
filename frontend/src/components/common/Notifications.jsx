import { useState, useEffect } from "react";
import { List, Button, Badge, Tooltip } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  MailOutlined,
  CloseCircleOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";
import { notificationService } from "../../services/notificationService";
import { noteService } from "../../services/noteService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Notifications = ({ max, onShowMore }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invalidInvitations, setInvalidInvitations] = useState({});

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(Array.isArray(response.data) ? response.data : []);
    } catch {
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptInvitation = async (notification) => {
    try {
      await noteService.acceptCollaboration(notification.data.note_uuid);
      await notificationService.markAsRead(notification.id);
      await fetchNotifications();
      toast.success("Invitation accepted");
      navigate("/shared");
    } catch (err) {
      if (
        err?.response?.data?.message === "No pending invitation found" ||
        err?.response?.data?.message === "Unauthorized"
      ) {
        setInvalidInvitations((prev) => ({ ...prev, [notification.id]: true }));
        await notificationService.markAsRead(notification.id);
        await fetchNotifications();
        toast.error("This invitation is no longer valid.");
      } else {
        toast.error("Failed to accept invitation");
      }
    }
  };

  const handleDeclineInvitation = async (notification) => {
    try {
      await noteService.declineCollaboration(notification.data.note_uuid);
      await notificationService.markAsRead(notification.id);
      await fetchNotifications();
      toast.success("Invitation declined");
    } catch (err) {
      if (
        err?.response?.data?.message === "No pending invitation found" ||
        err?.response?.data?.message === "Unauthorized"
      ) {
        setInvalidInvitations((prev) => ({ ...prev, [notification.id]: true }));
        await notificationService.markAsRead(notification.id);
        await fetchNotifications();
        toast.error("This invitation is no longer valid.");
      } else {
        toast.error("Failed to decline invitation");
      }
    }
  };

  const handleCancelInvitation = async (notification) => {
    try {
      await noteService.cancelInvitation(
        notification.data.note_uuid,
        notification.data.invited_user
      );
      await notificationService.markAsRead(notification.id);
      await fetchNotifications();
      toast.success("Invitation cancelled");
    } catch (err) {
      if (err?.response?.data?.message === "No pending invitation found") {
        toast.error("This invitation has already been accepted or declined.");
        await fetchNotifications();
      } else {
        toast.error("Failed to cancel invitation");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      await fetchNotifications();
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await fetchNotifications();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all notifications as read");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "invitation":
        return <UserAddOutlined />;
      case "invitation_sent":
        return <MailOutlined />;
      case "invitation_accepted":
        return <CheckCircleOutlined />;
      case "invitation_rejected":
      case "invitation_cancelled":
        return <CloseCircleOutlined />;
      case "collaboration_removed":
        return <UserDeleteOutlined />;
      default:
        return <BellOutlined />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "invitation":
      case "invitation_sent":
        return theme === "dark" ? "#60a5fa" : "#1890ff";
      case "invitation_accepted":
        return theme === "dark" ? "#34d399" : "#52c41a";
      case "invitation_rejected":
      case "invitation_cancelled":
      case "collaboration_removed":
        return theme === "dark" ? "#f87171" : "#ff4d4f";
      default:
        return theme === "dark" ? "#9ca3af" : "#6b7280";
    }
  };

  const getNotificationActions = (notification) => {
    const isHandled = !!notification.read_at;
    const isInvalid = invalidInvitations[notification.id];
    const isPending = notification.data?.status === "pending";
    switch (notification.type) {
      case "invitation":
        return (
          <>
            <Tooltip
              title={
                isHandled || isInvalid
                  ? "This invitation is no longer valid"
                  : "Accept"
              }
            >
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleAcceptInvitation(notification)}
                className="text-green-500 hover:text-green-600"
                style={{ padding: 4, borderRadius: 6 }}
                disabled={isHandled || isInvalid}
              />
            </Tooltip>
            <Tooltip
              title={
                isHandled || isInvalid
                  ? "This invitation is no longer valid"
                  : "Decline"
              }
            >
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleDeclineInvitation(notification)}
                className={
                  theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-600"
                }
                style={{ padding: 4, borderRadius: 6 }}
                disabled={isHandled || isInvalid}
              />
            </Tooltip>
          </>
        );
      case "invitation_sent":
        return (
          <Tooltip
            title={
              isHandled
                ? "Already handled"
                : isPending
                ? "Cancel"
                : "No longer pending"
            }
          >
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleCancelInvitation(notification)}
              className={
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-600"
              }
              style={{ padding: 4, borderRadius: 6 }}
              disabled={isHandled || !isPending}
            />
          </Tooltip>
        );
      default:
        return null;
    }
  };

  const displayedNotifications = max
    ? Array.isArray(notifications)
      ? notifications.slice(0, max)
      : []
    : Array.isArray(notifications)
    ? notifications
    : [];

  return (
    <div className={`notelit-notifications`}>
      <div
        className={`px-3 py-2 border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center">
          <h3
            className={`text-base font-semibold ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Notifications
          </h3>
          {notifications.length > 0 && (
            <Button
              type="link"
              onClick={handleMarkAllAsRead}
              className={`text-sm ${
                theme === "dark" ? "text-blue-400" : "text-blue-500"
              }`}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>
      <div
        className={`max-h-[500px] overflow-y-auto scrollbar-thin ${
          theme === "dark"
            ? "scrollbar-thumb-gray-700 scrollbar-track-gray-900"
            : "scrollbar-thumb-gray-300 scrollbar-track-transparent"
        }`}
      >
        <List
          dataSource={displayedNotifications}
          loading={loading}
          className="w-full"
          locale={{
            emptyText: (
              <div
                className={`text-center py-6 text-base ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No notifications
              </div>
            ),
          }}
          renderItem={(notification) => {
            const isUnread = !notification.read_at;
            let actorName = null;
            let actorEmail = null;
            let leaverName = null;
            let leaverEmail = null;
            let noteTitle = notification.data?.note_title || "a note";

            // Get actor information based on notification type
            if (notification.data) {
              switch (notification.type) {
                case "invitation":
                  actorName = notification.data.shared_by?.name;
                  actorEmail = notification.data.shared_by?.email;
                  break;
                case "invitation_sent":
                  actorName = notification.data.invited_user?.name;
                  actorEmail = notification.data.invited_user?.email;
                  break;
                case "invitation_accepted":
                  actorName = notification.data.accepted_by?.name;
                  actorEmail = notification.data.accepted_by?.email;
                  break;
                case "invitation_rejected":
                  actorName = notification.data.rejected_by?.name;
                  actorEmail = notification.data.rejected_by?.email;
                  break;
                case "invitation_cancelled":
                  actorName = notification.data.cancelled_by?.name;
                  actorEmail = notification.data.cancelled_by?.email;
                  break;
                case "collaboration_removed":
                  actorName = notification.data.removed_by?.name;
                  actorEmail = notification.data.removed_by?.email;
                  break;
                case "collaborator_left":
                  leaverName = notification.data.leaver?.name;
                  leaverEmail = notification.data.leaver?.email;
                  break;
              }
            }

            // Format message based on notification type
            let formattedMessage = notification.message;
            const isSelfRemoval =
              notification.type === "collaboration_removed" &&
              notification.data?.removed_by?.uuid &&
              notification.data?.removed_by?.uuid ===
                (user?.uuid || notification.user_id);

            if (notification.type === "invitation") {
              const displayName = actorName || actorEmail || "Someone";
              formattedMessage = `${displayName} invited you to collaborate on "${noteTitle}"`;
            } else if (notification.type === "invitation_sent") {
              const displayName = actorName || actorEmail || "Someone";
              formattedMessage = `You invited ${displayName} to collaborate on "${noteTitle}"`;
            } else if (notification.type === "invitation_accepted") {
              const displayName = actorName || actorEmail || "Someone";
              formattedMessage = `${displayName} accepted your invitation to collaborate on "${noteTitle}"`;
            } else if (notification.type === "invitation_rejected") {
              const displayName = actorName || actorEmail || "Someone";
              formattedMessage = `${displayName} rejected your invitation to collaborate on "${noteTitle}"`;
            } else if (notification.type === "invitation_cancelled") {
              const displayName = actorName || actorEmail || "Someone";
              formattedMessage = `${displayName} cancelled the invitation to collaborate on "${noteTitle}"`;
            } else if (notification.type === "collaboration_removed") {
              if (isSelfRemoval) {
                formattedMessage = `You left collaboration on "${noteTitle}"`;
              } else {
                const displayName = actorName || actorEmail || "Someone";
                formattedMessage = `${displayName} removed you from collaborating on "${noteTitle}"`;
              }
            } else if (notification.type === "collaborator_left") {
              const displayName = leaverName || leaverEmail || "Someone";
              formattedMessage = `${displayName} left your note "${noteTitle}"`;
            }

            return (
              <List.Item className="border-0 px-0 py-2 bg-transparent mx-2 overflow-x-hidden">
                <div
                  className={`flex items-start gap-3 w-full rounded-md p-3 transition-all relative ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 border-gray-700"
                      : "bg-white hover:bg-gray-100 border-gray-200"
                  }`}
                  style={{ minHeight: 56 }}
                >
                  <div
                    className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                    style={{
                      color: getNotificationColor(notification.type),
                      fontSize: 18,
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-semibold truncate ${
                        theme === "dark" ? "text-gray-100" : "text-gray-800"
                      }`}
                      style={{ wordBreak: "break-word" }}
                    >
                      {notification.title}
                    </div>
                    <div
                      className={`text-xs mt-0.5 truncate-2-lines ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                      style={{
                        wordBreak: "break-word",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {formattedMessage}
                    </div>
                    {notification.type === "collaborator_left" &&
                    leaverEmail &&
                    leaverEmail !== leaverName ? (
                      <div
                        className={`text-xs mt-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                        style={{ wordBreak: "break-word" }}
                      >
                        From: <span className="font-medium">{leaverEmail}</span>
                      </div>
                    ) : isSelfRemoval ? null : (
                      actorEmail &&
                      actorEmail !== actorName && (
                        <div
                          className={`text-xs mt-1 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                          style={{ wordBreak: "break-word" }}
                        >
                          From:{" "}
                          <span className="font-medium">{actorEmail}</span>
                        </div>
                      )
                    )}
                    <div className="flex items-center gap-1 mt-2">
                      {getNotificationActions(notification)}
                      <Tooltip title="Delete">
                        <Button
                          type="text"
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(notification.id)}
                          className={
                            theme === "dark"
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-500 hover:text-gray-600"
                          }
                          style={{ padding: 4, borderRadius: 6 }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                  {isUnread && (
                    <span
                      className={`absolute top-2 right-2 w-2 h-2 rounded-full z-10 ${
                        theme === "dark" ? "bg-blue-400" : "bg-blue-500"
                      }`}
                    ></span>
                  )}
                </div>
              </List.Item>
            );
          }}
        />
      </div>
      {max && notifications.length > max && (
        <div
          className={`p-2 text-center border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <Button
            type="link"
            onClick={onShowMore}
            className={`text-sm ${
              theme === "dark" ? "text-blue-400" : "text-blue-500"
            }`}
          >
            Show all notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
