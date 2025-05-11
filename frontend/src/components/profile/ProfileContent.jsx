import ProfileOverview from "./ProfileOverview";
import ProfilePreferences from "./ProfilePreferences";
import ProfileChangePassword from "./ProfileChangePassword";

const ProfileContent = ({ user, activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <ProfileOverview user={user} />;
      case "change-password":
        return <ProfileChangePassword />;
      case "preferences":
        return <ProfilePreferences user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="py-4 px-6 pb-0">
        <h1 className="text-2xl font-bold text-blue-600">
          {activeTab === "general"
            ? "Account Overview"
            : activeTab === "preferences"
            ? "User Preferences"
            : activeTab === "change-password"
            ? "Reset Password"
            : "Unknown Tab"}
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 mb-6">
          {activeTab === "general"
            ? "View and update your profile information"
            : activeTab === "preferences"
            ? "Customize your note-taking experience"
            : activeTab === "change-password"
            ? "Reset your account password"
            : "Invalid tab selected"}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 pt-0">{renderContent()}</div>
    </div>
  );
};

export default ProfileContent;
