import { useTheme } from "../../contexts/ThemeContext";
import ProfileOverview from "./ProfileOverview";
import ProfilePreferences from "./ProfilePreferences";

const ProfileContent = ({ user, activeTab }) => {
  const { theme } = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <ProfileOverview user={user} />;
      case "preferences":
        return <ProfilePreferences user={user} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`h-full flex flex-col rounded-lg shadow-sm border overflow-hidden ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="py-4 px-6 pb-0">
        <h1
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}
        >
          {activeTab === "general"
            ? "Account Overview"
            : activeTab === "preferences"
            ? "User Preferences"
            : "Unknown Tab"}
        </h1>
        <p
          className={`text-xs uppercase tracking-wider mt-1 mb-6 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {activeTab === "general"
            ? "View and update your profile information"
            : activeTab === "preferences"
            ? "Customize your note-taking experience"
            : "Invalid tab selected"}
        </p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-6 pt-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileContent;
