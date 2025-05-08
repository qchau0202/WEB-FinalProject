import { useState } from "react";
import useNoteManagement from "../hooks/useNoteManagement";
import Note from "../components/notes/Note";
import { Button, Input, Select, Empty, Spin } from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useSpace } from "../contexts/SpacesContext";

const { Option } = Select;

const Home = () => {
  const { selectedSpace } = useSpace();
  const { notes, addNote, updateNote, deleteNote, loading } =
    useNoteManagement();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("manual");

  const filteredNotes = notes
    .filter((note) => (selectedSpace ? note.spaceId === selectedSpace : true))
    .filter((note) =>
      searchQuery
        ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "manual") {
      return a.order - b.order;
    } else if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const newNotePlaceholder = {
    id: Date.now().toString(),
    title: "New Note",
    content: "",
    tags: [],
    files: [],
    spaceId: selectedSpace || null,
    createdAt: new Date().toISOString().split("T")[0],
  };

  const handleCreateNewNote = () => {
    addNote(newNotePlaceholder);
  };

  const getSpaceName = () => {
    if (!selectedSpace) return "All Notes";
    const space = notes.spaces?.find((space) => space.id === selectedSpace);
    return space ? space.name : "Selected Space";
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{getSpaceName()}</h1>
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              prefix={<SearchOutlined className="text-gray-400 text-lg" />}
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-64 text-base"
            />
            <div className="flex gap-2">
              <Select
                defaultValue="manual"
                onChange={(value) => setSortBy(value)}
                suffixIcon={<SortAscendingOutlined className="text-lg" />}
                className="w-32 text-base"
              >
                <Option value="manual">Manual</Option>
                <Option value="newest">Newest</Option>
                <Option value="oldest">Oldest</Option>
                <Option value="title">Title</Option>
              </Select>
              <div className="flex gap-1 border border-gray-200 rounded-md">
                <Button
                  icon={<AppstoreOutlined />}
                  onClick={() => setViewMode("grid")}
                  type="text"
                  className={`text-lg ${
                    viewMode === "grid" ? "bg-blue-50 text-blue-500" : ""
                  }`}
                />
                <Button
                  icon={<UnorderedListOutlined />}
                  onClick={() => setViewMode("list")}
                  type="text"
                  className={`text-lg ${
                    viewMode === "list" ? "bg-blue-50 text-blue-500" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

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
