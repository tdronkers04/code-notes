import { useState, useRef, useContext } from "react";
import { useAuth } from "@clerk/clerk-react";
import { NotesContextType, NoteType } from "../@types/notes";
import { NotesContext } from "../context/notesContext";
import { RotatingLines } from "react-loader-spinner";

export default function NewNote() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(
    document.createElement("textarea")
  );
  const { getToken } = useAuth();
  const { addNote } = useContext(NotesContext) as NotesContextType;

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    textAreaRef.current.style.height = "inherit";
    const scrollHeight = textAreaRef.current.scrollHeight;
    textAreaRef.current.style.height = `${scrollHeight}px`;
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    textAreaRef.current.style.height = `56px`; // reset the textarea height
    const createNote = async () => {
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:8000/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            mode: "cors",
          },
          body: JSON.stringify({ code: value }),
        });

        if (!response.ok) {
          throw new Error("The server was unable to create the new note.");
        }

        const newNote: NoteType = await response.json();
        addNote(newNote);
        setValue("");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else if (typeof err === "string") {
          setError({ message: err } as Error);
        }
      }
      setLoading(false);
    };
    createNote();
  };

  if (loading) {
    return (
      <div className="p-2 my-4 rounded-md min-w-[600px] max-w-[800px] min-h-[200px] max-h-[400px] flex justify-center items-center">
        <div>
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
      <div className="p-2 my-4 rounded-md min-w-[600px] max-w-[800px] min-h-[200px] max-h-[400px] flex flex-col justify-center">
        <h3 className="flex justify-center text-lg">
          ⚠️ Error: {error.message}
        </h3>
        <p className="flex justify-center">
          Please refresh the page and try again.
        </p>
      </div>
    );
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
          className="bg-purple-500 py-1 px-2 my-1 rounded-md cursor-pointer"
          type="submit"
          value="Submit"
        />
      </form>
    </div>
  );
}
