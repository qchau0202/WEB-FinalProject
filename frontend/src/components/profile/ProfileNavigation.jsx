import {
  UserOutlined,
  SettingOutlined,
  KeyOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const ProfileNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="h-full w-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Fixed Header */}
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-blue-600">Profile</h1>
        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
          Manage your account
        </p>
      </div>

      {/* Scrollable Navigation Items and Footer */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        <div className="p-3">
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer ${
                activeTab === "general"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab("general")}
            >
              <UserOutlined />
              <span>General</span>
            </div>
            <div
              className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer ${
                activeTab === "preferences"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab("preferences")}
            >
              <SettingOutlined />
              <span>Preferences</span>
            </div>
            <div
              className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer ${
                activeTab === "change-password"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab("change-password")}
            >
              <KeyOutlined />
              <span>Change Password</span>
            </div>
            <div
              className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer ${
                activeTab === "danger-zone"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab("danger-zone")}
            >
              <WarningOutlined />
              <span>Danger Zone</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100">
          <p className="text-gray-500 text-sm text-center">© 2025 Notelit</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavigation;
