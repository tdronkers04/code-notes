import { useState, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function NewNote({ setDataHook }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const textAreaRef = useRef(null);
  const { getToken } = useAuth();

  const handleInput = (e) => {
    setValue(e.target.value);
    textAreaRef.current.style.height = "inherit";
    const scrollHeight = textAreaRef.current.scrollHeight;
    textAreaRef.current.style.height = `${scrollHeight}px`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    textAreaRef.current.style.height = `56px`; // reset the textarea height
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
    <div className="p-2 my-4 rounded-md min-w-[600px] max-w-[800px] min-h-[200px] max-h-[400px]">
      <h2 className="text-lg">Add a New Note:</h2>
      <form className="" onSubmit={handleSubmit}>
        <label>
          <textarea
            placeholder="type code here..."
            className="bg-zinc-100 w-full text-black p-1 rounded-sm resize-none"
            value={value}
            onChange={handleInput}
            ref={textAreaRef}
          ></textarea>
        </label>
        <input
          className="bg-purple-500 py-1 px-2 my-1 rounded-md"
          type="submit"
          value="Submit"
        />
      </form>
    </div>
  );
}
