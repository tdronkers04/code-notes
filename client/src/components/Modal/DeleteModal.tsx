import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { RotatingLines } from "react-loader-spinner";

export default function DeleteModal({ noteId, handleClose }) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:8000/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          mode: "cors",
        },
      });

      if (response.status !== 204) {
        throw new Error("Something went wrong deleting this note.");
      }
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
