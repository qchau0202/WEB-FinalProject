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
      {/* Backdrop for mobile when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-200 z-30 ${
          collapsed ? "pointer-events-none opacity-0" : "block opacity-100"
        } md:hidden`}
        onClick={() => setCollapsed(true)}
      />
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
