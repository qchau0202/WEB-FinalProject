import { Button } from "antd";
import { useNote } from "../../contexts/NotesContext";

const NoteDeleteModal = () => {
  const { confirmDelete, handleDelete, setConfirmDelete } = useNote();

  if (!confirmDelete) return null;

  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-95 rounded-lg flex flex-col justify-center items-center z-10 p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-medium text-gray-800 mb-2">Delete Note</h3>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Are you sure you want to delete this note? This action cannot be undone.
      </p>
      <div className="flex gap-2">
        <Button onClick={() => setConfirmDelete(false)} className="text-base">
          Cancel
        </Button>
        <Button
          danger
          type="primary"
          onClick={handleDelete}
          className="text-base"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default NoteDeleteModal;