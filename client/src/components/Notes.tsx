import { useState, useEffect, useContext } from "react";
import { useAuth, UserButton } from "@clerk/clerk-react";
import Note from "./Note";
import NewNote from "./NewNote";
import { NotesContextType, NoteType } from "../@types/notes";
import { NotesContext } from "../context/notesContext";

function Notes() {
  const { getToken } = useAuth();
  const { notes, updateNotes } = useContext(NotesContext) as NotesContextType;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:8000/notes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            mode: "cors",
          },
        });

        if (!response.ok) {
          throw new Error(
            "Something went wrong fetching data from the server."
          );
        }

        const result = await response.json();
        updateNotes(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else if (typeof err === "string") {
          setError({ message: err } as Error);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [getToken]);

  if (loading) {
    return <div>"Loading..."</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-screen h-full text-zinc-50">
      <div className="w-[96%] h-[80px] -mb-4 flex justify-end items-end">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-[45px] h-[45px]",
              userButtonAvatarBox: "w-[45px] h-[45px]",
            },
          }}
        />
      </div>

      <div className="flex flex-col justify-start items-center">
        <h1 className="py-4 text-3xl text-purple-500">Code Notes</h1>
        <ul>
          {notes.map((item: NoteType) => {
            return (
              <Note
                key={item.id}
                noteId={item.id}
                code={item.code}
                title={item.title}
              />
            );
          })}
        </ul>
        <div>
          <NewNote />
        </div>
      </div>
    </div>
  );
}

export default Notes;
