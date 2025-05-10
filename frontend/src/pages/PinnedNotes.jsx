import { useState } from "react";
import { Button, Input, Select, Empty, Spin } from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  SearchOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import Note from "../components/notes/Note";
import useNoteManagement from "../hooks/useNoteManagement";

const { Option } = Select;

const PinnedNotes = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("manual");
  const {
    notes,
    updateNote,
    deleteNote,
    loading,
    filterAndSortNotes,
    togglePinNote,
  } = useNoteManagement();

  const sortedNotes = filterAndSortNotes(notes, {
    searchQuery,
    sortBy,
    showPinnedOnly: true,
  });

  return (
    <div className="overflow-y-auto">
      <div className="p-4 md:p-6 lg:p-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 truncate">
            Pinned Notes
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
                defaultValue="manual"
                onChange={(value) => setSortBy(value)}
                suffixIcon={<SortAscendingOutlined className="text-lg" />}
                className="w-full md:w-32 text-base"
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
                {sortedNotes.length > 0 ? (
                  sortedNotes.map((note, index) => (
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
                  ))
                ) : (
                  <div className="col-span-full">
                    <Empty
                      description={
                        searchQuery ? (
                          <span className="text-lg">
                            No matching pinned notes found
                          </span>
                        ) : (
                          <span className="text-lg">
                            No pinned notes yet. Pin your important notes to see
                            them here.
                          </span>
                        )
                      }
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
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
                            No matching pinned notes found
                          </span>
                        ) : (
                          <span className="text-lg">
                            No pinned notes yet. Pin your important notes to see
                            them here.
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

export default PinnedNotes;
