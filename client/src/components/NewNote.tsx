import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function NewNote({ setDataHook }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const { getToken } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    const createNote = async () => {
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:8000/new-note", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            mode: "cors",
          },
          body: JSON.stringify({ code: value }),
        });

        if (!response.ok) {
          throw new Error("Something went wrong posting data to the server.");
        }

        const updatedNotes = await response.json();
        setDataHook(updatedNotes);
        setValue("");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else if (typeof err === "string") {
          setError({ message: err } as Error);
        }
      }
    };
    createNote();
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-4 m-6 rounded-md min-w-[600px] max-w-[800px] min-h-[200px] max-h-[400px]">
      <h2 className="text-lg">Add a New Note:</h2>
      <form className="" onSubmit={handleSubmit}>
        <label>
          <textarea
            placeholder="type code here..."
            className="bg-zinc-100 w-full min-h-[100px] text-black p-1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
        </label>
        <input
          className="bg-lime-500 py-1 px-2 my-1 rounded-md"
          type="submit"
          value="Submit"
        />
      </form>
    </div>
  );
}
