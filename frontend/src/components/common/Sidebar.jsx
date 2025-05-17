import { useState, useEffect } from "react";
import { Button, Tooltip, Dropdown, Modal } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useLabel } from "../../contexts/LabelsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  UserOutlined,
  ExclamationCircleFilled,
  CloseOutlined,
  HomeOutlined,
  TagOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { IoShareSocial } from "react-icons/io5";
import LabelManagement from "../labels/LabelManagement";

const Sidebar = ({ collapsed, setCollapsed, hideBottomNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { selectedLabel, setSelectedLabel } = useLabel();
  const { theme, setTheme, themeClasses } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const [showVerification, setShowVerification] = useState(() => {
    return currentUser && currentUser.isVerified === false;
  });
  const [showLabelsModal, setShowLabelsModal] = useState(false);

  const isCollapsed = collapsed !== undefined ? collapsed : localCollapsed;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !isCollapsed) {
        setCollapsed?.(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isCollapsed, setCollapsed]);

  useEffect(() => {
    if (currentUser) {
      setShowVerification(currentUser.email_verified_at === null);
    } else {
      setShowVerification(false);
    }
  }, [currentUser]);

  const toggleCollapsed = () => {
    if (setCollapsed) {
      setCollapsed(!isCollapsed);
    } else {
      setLocalCollapsed(!localCollapsed);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Remove all theme-* keys from localStorage
      Object.keys(localStorage)
        .filter((key) => key.startsWith("theme-"))
        .forEach((key) => localStorage.removeItem(key));
      // Remove notes cache
      localStorage.removeItem("notelit-notes-cache");
      // Set theme to light mode safely
      if (typeof setTheme === "function") {
        setTheme("light");
      }
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleProfileClick = () => {
    if (currentUser) {
      navigate(`/profile/${currentUser.uuid}`);
      if (isMobile) {
        setCollapsed?.(true);
      }
    } else {
      toast.error("Please login to view your profile");
      navigate("/login");
    }
  };

  const settingsMenu = {
    items: [
      {
        key: "profile",
        label: "Profile",
        icon: <UserOutlined />,
        onClick: () => {
          if (currentUser) {
            navigate(`/profile/${currentUser.uuid}?tab=general`);
            if (isMobile) setCollapsed?.(true);
          } else {
            toast.error("Please login to view your profile");
            navigate("/login");
          }
        },
      },
      {
        key: "preferences",
        label: "Preferences",
        icon: <SettingOutlined />,
        onClick: () => {
          if (currentUser) {
            navigate(`/profile/${currentUser.uuid}?tab=preferences`);
            if (isMobile) setCollapsed?.(true);
          } else {
            toast.error("Please login to view preferences");
            navigate("/login");
          }
        },
      },
      {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ],
  };

  const isHomeActive = location.pathname === "/" && !selectedLabel;
  const isSharedActive = location.pathname === "/shared" && !selectedLabel;

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`h-screen flex-col border-r transition-all overflow-y-auto hidden md:flex ${
          isCollapsed ? "w-16" : "w-64"
        } ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-100"
          }`}
        >
          {!isCollapsed && (
            <Link to="/">
              <h1
                className={`text-xl md:text-2xl font-bold ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Notelit
              </h1>
            </Link>
          )}
          <Button
            type="text"
            icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
          />
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-2 flex flex-col">
          <div className={`px-3 ${isCollapsed ? "mb-2" : "mb-4"}`}>
            {!isCollapsed && (
              <h2
                className={`text-xs font-semibold uppercase tracking-wider mb-2 px-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Quick Access
              </h2>
            )}

            <div
              className={`flex ${
                isCollapsed ? "flex-col items-center" : "flex-col"
              } gap-1`}
            >
              <Tooltip title={isCollapsed ? "Home" : ""} placement="right">
                <div
                  className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer ${
                    isHomeActive
                      ? theme === "dark"
                        ? "bg-blue-900/50 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                      : theme === "dark"
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedLabel(null);
                    navigate("/");
                    if (isMobile) {
                      setCollapsed?.(true);
                    }
                  }}
                >
                  <HomeOutlined />
                  {!isCollapsed && <span>Home</span>}
                </div>
              </Tooltip>

              <Tooltip title={isCollapsed ? "Shared" : ""} placement="right">
                <div
                  className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer ${
                    isSharedActive
                      ? theme === "dark"
                        ? "bg-blue-900/50 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                      : theme === "dark"
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedLabel(null);
                    navigate("/shared");
                    if (isMobile) {
                      setCollapsed?.(true);
                    }
                  }}
                >
                  <IoShareSocial />
                  {!isCollapsed && <span>Shared Notes</span>}
                </div>
              </Tooltip>
            </div>
          </div>

          <LabelManagement
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            setCollapsed={setCollapsed}
            navigate={navigate}
          />
        </div>

        {/* Footer */}
        <div className={`p-3 ${isCollapsed ? "flex justify-center" : ""}`}>
          {/* Login reminder or verification warning */}
          {!isCollapsed && !isAuthenticated && (
            <div
              className={`mb-3 p-3 rounded-md flex items-start gap-3 relative ${
                theme === "dark"
                  ? "bg-blue-900/50 border border-blue-800"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <ExclamationCircleFilled
                className={`text-lg mt-0.5 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-500"
                }`}
              />
              <div
                className={`flex-1 min-w-0 text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-blue-800"
                }`}
              >
                Please login to access all features. <br />
                <button
                  className={`text-xs mt-1 ${
                    theme === "dark"
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:underline"
                  }`}
                  onClick={() => navigate("/login")}
                >
                  Login now
                </button>
              </div>
              <button
                className={`absolute top-2 right-2 text-xs ${
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-500 hover:text-blue-700"
                }`}
                onClick={() => setShowVerification(false)}
                aria-label="Close notification"
              >
                <CloseOutlined />
              </button>
            </div>
          )}

          {/* Verification warning */}
          {!isCollapsed && showVerification && currentUser && (
            <div
              className={`mb-3 p-3 rounded-md flex items-start gap-3 relative ${
                theme === "dark"
                  ? "bg-yellow-900/50 border border-yellow-800"
                  : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <ExclamationCircleFilled
                className={`text-lg mt-0.5 ${
                  theme === "dark" ? "text-yellow-400" : "text-yellow-500"
                }`}
              />
              <div
                className={`flex-1 min-w-0 text-xs ${
                  theme === "dark" ? "text-yellow-300" : "text-yellow-800"
                }`}
              >
                Your account is not verified. Please check your email to
                activate your account. <br />
                <button
                  className={`text-xs mt-1 ${
                    theme === "dark"
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:underline"
                  }`}
                  onClick={handleProfileClick}
                >
                  Account overview
                </button>
              </div>
              <button
                className={`absolute top-2 right-2 text-xs ${
                  theme === "dark"
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-yellow-500 hover:text-yellow-700"
                }`}
                onClick={() => setShowVerification(false)}
                aria-label="Close notification"
              >
                <CloseOutlined />
              </button>
            </div>
          )}

          {/* User info */}
          {isCollapsed ? (
            <Dropdown
              menu={settingsMenu}
              trigger={["click"]}
              placement="topRight"
            >
              <div className="flex flex-col items-center">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover mb-2"
                  style={{ display: "block" }}
                />

                <span className="sr-only">{currentUser?.name || "Guest"}</span>
                <span className="sr-only">
                  {currentUser?.email || "Not logged in"}
                </span>
              </div>
            </Dropdown>
          ) : (
            <div
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <Dropdown
                menu={settingsMenu}
                trigger={["click"]}
                placement="topRight"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserOutlined
                        className={
                          theme === "dark" ? "text-blue-400" : "text-blue-600"
                        }
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium truncate ${
                        theme === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {currentUser?.name || "Guest"}
                    </div>
                    <div
                      className={`text-xs truncate ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {currentUser?.email || "Not logged in"}
                    </div>
                  </div>
                </div>
              </Dropdown>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {!hideBottomNav && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-2 md:hidden ${themeClasses.bg.secondary} ${themeClasses.border.primary} border-t`}
        >
          <Button
            type="text"
            icon={<HomeOutlined />}
            onClick={() => {
              setSelectedLabel(null);
              navigate("/");
            }}
            size="large"
          />
          <Button
            type="text"
            icon={<IoShareSocial />}
            onClick={() => {
              setSelectedLabel(null);
              navigate("/shared");
            }}
            size="large"
          />
          <Button
            type="text"
            icon={<TagOutlined />}
            onClick={() => setShowLabelsModal(true)}
            size="large"
          />

          <Dropdown menu={settingsMenu} trigger={["click"]} placement="top">
            <Button type="text" size="large">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover"
                style={{ display: "block" }}
              />
              <span className="sr-only">{currentUser?.name || "Guest"}</span>
              <span className="sr-only">
                {currentUser?.email || "Not logged in"}
              </span>
            </Button>
          </Dropdown>
        </div>
      )}

      {/* Labels Modal for Mobile */}
      <Modal
        open={showLabelsModal}
        onCancel={() => setShowLabelsModal(false)}
        footer={null}
        className="md:hidden px-2"
        closable={false}
      >
        <LabelManagement
          isCollapsed={false}
          isMobile={true}
          setCollapsed={setCollapsed}
          navigate={navigate}
        />
      </Modal>
    </>
  );
};

export default Sidebar;
