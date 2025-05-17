import { UserOutlined, SettingOutlined } from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";

const navItems = [
  {
    key: "general",
    icon: <UserOutlined />,
    label: "General",
  },
  {
    key: "preferences",
    icon: <SettingOutlined />,
    label: "Preferences",
  },
];

const ProfileNavigation = ({ activeTab, setActiveTab }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`w-full rounded-lg shadow-sm border overflow-hidden
        ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        }
        flex flex-col md:h-full md:flex-col
      `}
    >
      {/* Header */}
      <div
        className={`p-4 border-b
          ${theme === "dark" ? "border-gray-700" : "border-gray-100"}
        `}
      >
        <h1
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}
        >
          Profile
        </h1>
        <p
          className={`text-xs uppercase tracking-wider mt-1 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Manage your account
        </p>
      </div>
      {/* Navigation Items */}
      <div className="flex-1 flex flex-col md:justify-between">
        {/* Nav: horizontal on mobile, vertical on desktop */}
        <nav className="sm:px-2 py-2 md:p-3">
          <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {navItems.map((item) => (
              <div
                key={item.key}
                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer whitespace-nowrap
                  ${
                    activeTab === item.key
                      ? theme === "dark"
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                      : theme === "dark"
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
                onClick={() => setActiveTab(item.key)}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </nav>
        {/* Footer */}
        <div
          className={`p-3 border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-100"
          } mt-auto`}
        >
          <p
            className={`text-sm text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            © 2025 Notelit
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavigation;

// import { UserOutlined, SettingOutlined } from "@ant-design/icons";
// import { useTheme } from "../../contexts/ThemeContext";

// const ProfileNavigation = ({ activeTab, setActiveTab }) => {
//   const { theme, themeClasses } = useTheme();

//   return (
//     <div
//       className={`h-full w-full flex flex-col rounded-lg shadow-sm border ${themeClasses.bg.secondary} ${themeClasses.border.secondary} overflow-hidden`}
//     >
//       <div
//         className={`p-4 border-b ${themeClasses.border.secondary}`}
//       >
//         <h1
//           className={`text-2xl font-bold ${
//             theme === "dark" ? "text-blue-400" : "text-blue-600"
//           }`}
//         >
//           Profile
//         </h1>
//         <p
//           className={`text-xs uppercase tracking-wider mt-1 ${themeClasses.text.muted}`}
//         >
//           Manage your account
//         </p>
//       </div>
//       <div className="flex flex-col justify-between overflow-y-auto">
//         <div className="p-3">
//           <div className="flex flex-col gap-1">
//             <div
//               className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer ${
//                 activeTab === "general"
//                   ? theme === "dark"
//                     ? "bg-blue-900/30 text-blue-400"
//                     : "bg-blue-50 text-blue-600"
//                   : `${themeClasses.bg.hover} ${themeClasses.text.secondary}`
//               }`}
//               onClick={() => setActiveTab("general")}
//             >
//               <UserOutlined />
//               <span>General</span>
//             </div>
//             <div
//               className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer ${
//                 activeTab === "preferences"
//                   ? theme === "dark"
//                     ? "bg-blue-900/30 text-blue-400"
//                     : "bg-blue-50 text-blue-600"
//                   : `${themeClasses.bg.hover} ${themeClasses.text.secondary}`
//               }`}
//               onClick={() => setActiveTab("preferences")}
//             >
//               <SettingOutlined />
//               <span>Preferences</span>
//             </div>
//           </div>
//         </div>
//         <div
//           className={`p-3 border-t ${themeClasses.border.secondary}`}
//         >
//           <p
//             className={`text-sm text-center ${themeClasses.text.muted}`}
//           >
//             © 2025 Notelit
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileNavigation;
