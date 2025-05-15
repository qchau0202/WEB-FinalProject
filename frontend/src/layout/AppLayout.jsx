import { useState } from "react";
import { Outlet } from "react-router-dom";
import { App } from "antd";
import Sidebar from "../components/common/Sidebar";
import { useTheme } from "../contexts/ThemeContext";

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
