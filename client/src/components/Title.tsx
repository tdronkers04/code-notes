import React, { useState, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ThreeDots } from 'react-loader-spinner';
import { NotesContext } from '../context/notesContext';
import { NotesContextType } from '../@types/notes';

const API_URL = import.meta.env.VITE_API_URL;

function Title({ noteId, title }: { noteId: string; title: string }) {
  const { getToken } = useAuth();
  const { editNote } = useContext(NotesContext) as NotesContextType;
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleApiRequest = async () => {
    setLoading(true);

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/notes/${noteId}/title`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          mode: 'cors',
        },
        body: JSON.stringify({ title: newTitle }),
      });
      const updatedNote = await response.json();
      editNote(updatedNote);

      if (response.status !== 200) {
        throw new Error('Something went wrong updating the note title.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        // setError(err);
        alert(err);
      } else if (typeof err === 'string') {
        // setError({ message: err } as Error);
        alert(err);
      }
    }
    setNewTitle('');
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditing(false);
      handleApiRequest();
    }
  };

  const handleOnBlur = () => {
    setEditing(false);
    handleApiRequest();
  };

  if (editing) {
    return (
      <input
        className="ml-3 px-1 text-black"
        type="text"
        placeholder={title}
        onChange={handleInput}
        onBlur={handleOnBlur}
        onKeyUp={handleKeyPress}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    );
  }

  if (loading) {
    return (
      <ThreeDots
        height="60"
        width="60"
        radius="1"
        color="rgb(168 85 247)"
        ariaLabel="three-dots-loading"
        wrapperClass="p-5"
        visible={true}
      />
    );
  }

  return (
    <div
      className="px-3"
      onClick={() => setEditing(true)}
      onKeyUp={() => setEditing(true)}
      role="button"
      tabIndex={0}
    >
      {title}
    </div>
  );
}

export default Title;
