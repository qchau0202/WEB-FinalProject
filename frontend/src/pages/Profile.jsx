import { useState } from "react";
import { useParams } from "react-router-dom";
import { App } from "antd";
import ProfileNavigation from "../components/profile/ProfileNavigation";
import ProfileContent from "../components/profile/ProfileContent";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Profile = () => {
  const { id } = useParams();
  const { currentUser, isLoading } = useAuth();
  const { theme } = useTheme();
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState("general");

  if (isLoading) {
    return (
      <div
        className={`p-6 ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Loading...
      </div>
    );
  }

  if (!currentUser || currentUser.uuid !== id) {
    message.error("User not found");
    return (
      <div
        className={`p-6 ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        User not found
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="flex flex-col md:flex-row gap-4 sm:gap-4 w-full h-[80vh] sm:h-[85vh] overflow-hidden">
        <div className="md:w-1/4 py-2">
          <ProfileNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
        <div className="md:w-3/4 py-2">
          <ProfileContent user={currentUser} activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
