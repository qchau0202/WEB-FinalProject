import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import { useSpace } from "../contexts/SpacesContext";
import { notes } from "../mock-data/notes";
import useNoteManagement from "../hooks/useNoteManagement";

const AppLayout = () => {
  const { selectedSpace, setSelectedSpace } = useSpace();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useNoteManagement(notes);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        onSpaceSelect={setSelectedSpace}
        selectedSpace={selectedSpace}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <Outlet context={{ selectedSpace }} />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
