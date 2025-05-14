import { useState } from "react";
import { useParams } from "react-router-dom";
import { message } from "antd";
import ProfileNavigation from "../components/profile/ProfileNavigation";
import ProfileContent from "../components/profile/ProfileContent";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { id } = useParams();
  const { currentUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("general");

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (!currentUser || currentUser.id !== parseInt(id)) {
    message.error("User not found");
    return <div className="p-6 text-gray-500">User not found</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col md:flex-row gap-4 sm:gap-4 w-full h-[80vh] sm:h-[85vh] overflow-hidden">
        {/* Navigation Card */}
        <div className="md:w-1/4 py-2">
          <ProfileNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
        {/* Content Card */}
        <div className="md:w-3/4 py-2">
          <ProfileContent user={currentUser} activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
