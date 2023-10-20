import { useState, useContext } from "react";
import { useAuth } from "@clerk/clerk-react";
import { RotatingLines } from "react-loader-spinner";
import { NotesContext } from "../../context/notesContext";
import { NotesContextType } from "../../@types/notes";

const API_URL = import.meta.env.VITE_API_URL;

export default function DeleteModal({
  noteId,
  handleClose,
}: {
  noteId: string;
  handleClose: () => void;
}) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { deleteNote } = useContext(NotesContext) as NotesContextType;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          mode: "cors",
        },
      });

      if (response.status !== 204) {
        throw new Error("Something went wrong deleting this note.");
      }
      deleteNote(noteId);
      setLoading(false);
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else if (typeof err === "string") {
        setError({ message: err } as Error);
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-200 h-[200px] w-[500px] border-1 border-zinc-700 rounded-md grid grid-rows-2">
        <h1 className="bg-purple-500 p-3 rounded-t-md border-1 border-zinc-700 row-span-1 flex justify-center items-center">
          Loading...
        </h1>
        <div className="row-span-1 p-2 flex justify-center items-center">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="70"
            visible={true}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-200 h-[200px] w-[500px] border-1 border-zinc-700 rounded-md grid grid-rows-2">
        <h1 className="bg-purple-500 p-3 rounded-t-md border-1 border-zinc-700 row-span-1 flex justify-center items-center">
          Error: {error.message}
        </h1>
        <div className="row-span-1 p-2 flex justify-center items-center">
          <button
            className="rounded-md w-[100px] mx-1 text-purple-500 bg-white  py-2 border-2 border-zinc-700"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-200 h-[200px] w-[500px] border-1 border-zinc-700 rounded-md grid grid-rows-2">
      <h1 className="bg-purple-500 p-3 rounded-t-md border-1 border-zinc-700 row-span-1 flex justify-center items-center">
        Are you sure you would like to delete this note?
      </h1>
      <div className="row-span-1 p-2 flex justify-center items-center">
        <button
          className="rounded-md w-[100px] mx-1 text-white bg-purple-500  py-2 border-2 border-zinc-700"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="rounded-md w-[100px] mx-1 text-purple-500 bg-white  py-2 border-2 border-zinc-700"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
