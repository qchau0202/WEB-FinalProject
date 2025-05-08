import { useState } from "react";
import { Button, Tooltip, Dropdown, Menu } from "antd";
import { spaces } from "../../mock-data/notes";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  DownOutlined,
  RightOutlined,
  FileTextOutlined,
  PlusOutlined,
  StarOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const Sidebar = ({ onSpaceSelect, selectedSpace, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const [spacesOpen, setSpacesOpen] = useState(true);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isCollapsed = collapsed !== undefined ? collapsed : useState(false)[0];
  const toggleCollapsed = () => {
    if (setCollapsed) {
      setCollapsed(!isCollapsed);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const settingsMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      className={`h-screen bg-white flex flex-col border-r border-gray-200 transition-all overflow-y-auto ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        } border-b border-gray-100`}
      >
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-blue-600">Notelit</h1>
        )}
        <Button
          type="text"
          icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          className="text-gray-500"
        />
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
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
            <Tooltip title={isCollapsed ? "All Notes" : ""} placement="right">
              <div
                className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer ${
                  !selectedSpace
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => {
                  onSpaceSelect(null);
                  navigate("/");
                }}
              >
                <FileTextOutlined />
                {!isCollapsed && <span>All Notes</span>}
              </div>
            </Tooltip>

            <Tooltip title={isCollapsed ? "Favorites" : ""} placement="right">
              <div
                className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700"
                onClick={() => navigate("/favorites")}
              >
                <StarOutlined />
                {!isCollapsed && <span>Favorites</span>}
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Spaces */}
        <div className="px-3">
          {!isCollapsed && (
            <div
              className="flex items-center justify-between px-2 mb-2 cursor-pointer"
              onClick={() => setSpacesOpen(!spacesOpen)}
            >
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Spaces
              </h2>
              {spacesOpen ? (
                <DownOutlined className="text-gray-400 text-xs" />
              ) : (
                <RightOutlined className="text-gray-400 text-xs" />
              )}
            </div>
          )}

          {(spacesOpen || isCollapsed) && (
            <div
              className={`flex ${
                isCollapsed ? "flex-col items-center" : "flex-col"
              } gap-1`}
            >
              {spaces.map((space) => (
                <Tooltip
                  key={space.id}
                  title={isCollapsed ? space.name : ""}
                  placement="right"
                >
                  <div
                    className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer ${
                      selectedSpace === space.id
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => {
                      onSpaceSelect(space.id);
                      navigate("/");
                    }}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${space.color}`}
                    ></div>
                    {!isCollapsed && (
                      <span className="truncate">{space.name}</span>
                    )}
                  </div>
                </Tooltip>
              ))}

              {!isCollapsed && (
                <div
                  className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-100 text-gray-500 mt-1"
                  onClick={() => {
                    /* Handle create space */
                  }}
                >
                  <PlusOutlined className="text-xs" />
                  <span>New Space</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className={`p-3 border-t border-gray-100 ${
          isCollapsed ? "flex justify-center" : ""
        }`}
      >
        {isCollapsed ? (
          <Tooltip title="Settings" placement="right">
            <Dropdown
              overlay={settingsMenu}
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
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-xs">
                {currentUser?.display_name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-lg font-medium">
                {currentUser?.display_name || "User"}
              </span>
            </div>
            <Dropdown
              overlay={settingsMenu}
              trigger={["click"]}
              placement="topRight"
            >
              <SettingOutlined className="text-gray-500 cursor-pointer" />
            </Dropdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
