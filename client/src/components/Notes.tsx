import { useState, useEffect, useContext } from 'react';
import { useAuth, UserButton } from '@clerk/clerk-react';
import Note from './Note';
import NewNote from './NewNote';
import { NotesContextType, NoteType } from '../@types/notes';
import { NotesContext } from '../context/notesContext';
import NotesSkeleton from './NotesSkeleton';

const API_URL = import.meta.env.VITE_API_URL;

function Notes() {
  const { getToken } = useAuth();
  const { notes, updateNotes } = useContext(NotesContext) as NotesContextType;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/notes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            mode: 'cors',
          },
        });

        if (!response.ok) {
          throw new Error(
            'Something went wrong fetching data from the server.',
          );
        }

        const result = await response.json();
        updateNotes(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else if (typeof err === 'string') {
          setError({ message: err } as Error);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <NotesSkeleton />;
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col gap-2 justify-center items-center">
        <h3 className="text-zinc-50 text-xl">⚠️ Error: {error.message}</h3>
        <div className="text-zinc-50 text-lg">
          Please refresh the page and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-full text-zinc-50">
      <div className="w-[96%] h-[80px] -mb-4 flex justify-end items-end">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'w-[45px] h-[45px]',
              userButtonAvatarBox: 'w-[45px] h-[45px]',
            },
          }}
        />
      </div>

      <div className="flex flex-col justify-start items-center">
        <h1 className="py-4 text-3xl text-purple-500 underline">Code Notes</h1>
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
