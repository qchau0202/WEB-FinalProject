import { useState, useEffect } from "react";
import { Button, Tooltip, Dropdown } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useLabel } from "../../contexts/LabelsContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  UserOutlined,
  PushpinOutlined,
  ExclamationCircleFilled,
  CloseOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import LabelManagement from "../labels/LabelManagement";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { selectedLabel, setSelectedLabel } = useLabel();
  const [isMobile, setIsMobile] = useState(false);
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const [showVerification, setShowVerification] = useState(() => {
    return currentUser && currentUser.isVerified === false;
  });

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
      setShowVerification(currentUser.isVerified === false);
    }
  }, [currentUser]);

  const toggleCollapsed = () => {
    if (setCollapsed) {
      setCollapsed(!isCollapsed);
    } else {
      setLocalCollapsed(!localCollapsed);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (currentUser) {
      navigate(`/profile/${currentUser.id}`);
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
        onClick: handleProfileClick,
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
    <div
      className={`h-screen bg-white flex flex-col border-r border-gray-200 transition-all overflow-y-auto ${
        isCollapsed ? "w-16" : "w-64"
      } ${isMobile ? "fixed z-50" : "relative"}`}
    >
      {/* Header */}
      <div
        className={`p-4 flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        } border-b border-gray-100`}
      >
        {!isCollapsed && (
          <Link to="/">
            <h1 className="text-xl md:text-2xl font-bold text-blue-600">
              Notelit
            </h1>
          </Link>
        )}
        <Button
          type="text"
          icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          className="text-gray-500"
        />
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-2 flex flex-col">
        {/* Quick Access */}
        <div className={`px-3 ${isCollapsed ? "mb-2" : "mb-4"}`}>
          {!isCollapsed && (
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
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
                    ? "bg-blue-50 text-blue-600"
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
                    ? "bg-blue-50 text-blue-600"
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
                <PushpinOutlined />
                {!isCollapsed && <span>Shared Notes</span>}
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Labels */}
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
        {!isCollapsed && !isAuthenticated() && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-3 relative">
            <ExclamationCircleFilled className="text-blue-500 text-lg mt-0.5" />
            <div className="flex-1 min-w-0 text-xs text-blue-800">
              Please login to access all features. <br />
              <button
                className="text-blue-600 hover:underline text-xs mt-1"
                onClick={() => navigate("/login")}
              >
                Login now
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 text-xs"
              onClick={() => setShowVerification(false)}
              aria-label="Close notification"
            >
              <CloseOutlined />
            </button>
          </div>
        )}

        {/* Verification warning */}
        {!isCollapsed && showVerification && currentUser && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-3 relative">
            <ExclamationCircleFilled className="text-yellow-500 text-lg mt-0.5" />
            <div className="flex-1 min-w-0 text-xs text-yellow-800">
              Your account is not verified. Please check your email to activate
              your account. <br />
              <button
                className="text-blue-600 hover:underline text-xs mt-1"
                onClick={handleProfileClick}
              >
                Account overview
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-yellow-500 hover:text-yellow-700 text-xs"
              onClick={() => setShowVerification(false)}
              aria-label="Close notification"
            >
              <CloseOutlined />
            </button>
          </div>
        )}

        {/* User info */}
        {isCollapsed ? (
          <Tooltip title="Settings" placement="right">
            <Dropdown
              menu={settingsMenu}
              trigger={["click"]}
              placement="topRight"
            >
              <div className="p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <SettingOutlined className="text-gray-500" />
              </div>
            </Dropdown>
          </Tooltip>
        ) : (
          <div className="flex items-center justify-between">
            {currentUser ? (
              <>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleProfileClick}
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-xs">
                    {currentUser.display_name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-base md:text-lg font-medium truncate max-w-[120px]">
                    {currentUser.display_name || "User"}
                  </span>
                </div>
                <Dropdown
                  menu={settingsMenu}
                  trigger={["click"]}
                  placement="topRight"
                >
                  <SettingOutlined className="text-gray-500 cursor-pointer" />
                </Dropdown>
              </>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Button
                  type="primary"
                  onClick={() => navigate("/login")}
                  className="w-full"
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
