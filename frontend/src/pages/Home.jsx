import { useState } from "react";
import useNoteManagement from "../hooks/useNoteManagement";
import Note from "../components/notes/Note";
import {
  Button,
  Input,
  Select,
  Empty,
  Spin,
  Badge,
  Dropdown,
  Menu,
} from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  PlusOutlined,
  DownOutlined,
  UpOutlined,
  PushpinOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { MdNotifications } from "react-icons/md";
import { useSpace } from "../contexts/SpacesContext";
import { useNavigate } from "react-router-dom";
import Notifications from "../components/common/Notifications";
import notificationsData from "../mock-data/notifications";
const { Option } = Select;

const Home = () => {
  const navigate = useNavigate();
  const { selectedSpace } = useSpace();
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    loading,
    filterAndSortNotes,
    togglePinNote,
  } = useNoteManagement();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("manual");
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const notifications = notificationsData;
  const unreadCount = notifications.length;

  const sortedNotes = filterAndSortNotes(notes, {
    searchQuery,
    sortBy,
    selectedSpace,
    showPinnedOnly: false,
  });

  const pinnedNotes = filterAndSortNotes(notes, {
    searchQuery,
    sortBy,
    selectedSpace,
    showPinnedOnly: true,
  });

  const displayedPinnedNotes = pinnedNotes.slice(0, 4);
  const remainingPinnedCount = Math.max(0, pinnedNotes.length - 4);

  const newNotePlaceholder = {
    id: Date.now().toString(),
    title: "New Note",
    content: "",
    tags: [],
    files: [],
    spaceId: selectedSpace || null,
    createdAt: new Date().toISOString().split("T")[0],
    isPinned: false,
    order: notes.length,
  };

  const handleCreateNewNote = () => {
    addNote(newNotePlaceholder);
  };

  const getSpaceName = () => {
    if (!selectedSpace) return "All Notes";
    const space = notes.spaces?.find((space) => space.id === selectedSpace);
    return space ? space.name : "Selected Space";
  };

  const handleNoteClick = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  const handleShowMore = (e) => {
    e.stopPropagation();
    setShowAllNotifications(true);
  };

  return (
    <div className="overflow-y-auto">
      <div className="p-4 md:p-6 lg:p-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 truncate">
            {getSpaceName()}
          </h1>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <Input
              prefix={<SearchOutlined className="text-gray-400 text-lg" />}
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 text-base"
            />
            <div className="flex gap-2 w-full md:w-auto">
              <Select
                defaultValue="newest"
                onChange={(value) => setSortBy(value)}
                suffixIcon={<SortAscendingOutlined className="text-lg" />}
                className="w-full md:w-32 text-base"
              >
                <Option value="newest">Newest</Option>
                <Option value="oldest">Oldest</Option>
                <Option value="title">Title</Option>
              </Select>
              <div className="flex gap-1 border border-gray-200 rounded-md">
                <Button
                  icon={<AppstoreOutlined />}
                  onClick={() => setViewMode("grid")}
                  type={viewMode === "grid" ? "primary" : "text"}
                  style={{
                    backgroundColor: viewMode === "grid" ? "#e6f7ff" : "",
                    borderColor: viewMode === "grid" ? "#e6f7ff" : "",
                    color: viewMode === "grid" ? "#1890ff" : "",
                  }}
                  className="text-lg"
                />
                <Button
                  icon={<UnorderedListOutlined />}
                  onClick={() => setViewMode("list")}
                  type={viewMode === "list" ? "primary" : "text"}
                  style={{
                    backgroundColor: viewMode === "list" ? "#e6f7ff" : "",
                    borderColor: viewMode === "list" ? "#e6f7ff" : "",
                    color: viewMode === "list" ? "#1890ff" : "",
                  }}
                  className="text-lg"
                />
              </div>
              <Dropdown
                overlay={
                  <Notifications
                    notifications={notifications}
                    max={showAllNotifications ? notifications.length : 3}
                    onShowMore={handleShowMore}
                  />
                }
                trigger={["click"]}
                visible={notificationVisible}
                onVisibleChange={(visible) => {
                  setNotificationVisible(visible);
                  if (!visible) setShowAllNotifications(false);
                }}
                placement="bottomRight"
              >
                <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                  <Button icon={<MdNotifications />} className="text-lg" />
                </Badge>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Pinned notes section */}
        {pinnedNotes.length > 0 && (
          <div className="mb-8">
            <div
              className="flex items-center justify-between cursor-pointer mb-4"
              onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
            >
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  Pinned Notes
                </h2>
                <Button
                  type="text"
                  icon={isPinnedExpanded ? <DownOutlined /> : <UpOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPinnedExpanded(!isPinnedExpanded);
                  }}
                  className="border-1"
                />
              </div>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out ${
                isPinnedExpanded
                  ? "opacity-100 max-h-[500px]"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <div className="flex gap-4">
                {displayedPinnedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex-none w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => handleNoteClick(note.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {note.title}
                      </h3>
                      <Button
                        icon={<PushpinOutlined />}
                        type="primary"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinNote(note.id);
                        }}
                        className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {new Date(
                          note.updatedAt || note.createdAt
                        ).toLocaleDateString()}
                      </span>
                      {note.tags?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          {note.tags.length} tags
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {remainingPinnedCount > 0 && (
                  <div className="flex items-center justify-center">
                    <div>
                      <Button
                        type="link"
                        size="large"
                        className="px-2 py-0 border-1 hover:text-blue-600 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/pinned");
                        }}
                      >
                        +{remainingPinnedCount}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="w-full pb-16">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {/* Create New Note Card */}
                <div
                  className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-100 hover:border-gray-300 w-full"
                  style={{ minHeight: "220px" }}
                  onClick={handleCreateNewNote}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="bg-gray-200 rounded-full p-2">
                      <PlusOutlined className="text-blue-500 text-xl" />
                    </div>
                    <span className="text-gray-500 font-medium text-base">
                      Create New Note
                    </span>
                  </div>
                </div>

                {/* Notes Grid */}
                {sortedNotes.map((note, index) => (
                  <div key={note.id} className="w-full">
                    <Note
                      note={note}
                      index={index}
                      onUpdate={updateNote}
                      onDelete={deleteNote}
                      onTogglePin={togglePinNote}
                      viewMode={viewMode}
                      isDetailView={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Create New Note Card */}
                <div
                  className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-100 hover:border-gray-300 w-full"
                  style={{ minHeight: "120px" }}
                  onClick={handleCreateNewNote}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="bg-blue-100 rounded-full p-2">
                      <PlusOutlined className="text-blue-500 text-xl" />
                    </div>
                    <span className="text-gray-500 font-medium text-base">
                      Create New Note
                    </span>
                  </div>
                </div>

                {/* Notes List */}
                {sortedNotes.length > 0 ? (
                  sortedNotes.map((note, index) => (
                    <div key={note.id}>
                      <Note
                        note={note}
                        index={index}
                        onUpdate={updateNote}
                        onDelete={deleteNote}
                        onTogglePin={togglePinNote}
                        viewMode={viewMode}
                        isDetailView={false}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Empty
                      description={
                        searchQuery ? (
                          <span className="text-lg">
                            No matching notes found
                          </span>
                        ) : (
                          <span className="text-lg">
                            No notes yet. Create your first note!
                          </span>
                        )
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
