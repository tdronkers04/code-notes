import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ThreeDots } from 'react-loader-spinner';
import { NotesContext } from '../context/notesContext';
import { NotesContextType } from '../@types/notes';
import { BiCheckCircle, BiError } from 'react-icons/bi';
import { IconContext } from 'react-icons';

const API_URL = import.meta.env.VITE_API_URL;

function Title({ noteId, title }: { noteId: string; title: string }) {
  const { getToken } = useAuth();
  const { editNote } = useContext(NotesContext) as NotesContextType;
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const iconSize = useMemo(() => ({ size: '1.3em' }), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const minimumTitleLength = 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setSuccess(false);
      setError(null);
    }, 5000);

    return () => clearInterval(timer);
  }, [success, error]);

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
      setSuccess(true);
      if (response.status !== 200) {
        throw new Error('Something went wrong updating the note title.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else if (typeof err === 'string') {
        setError({ message: err } as Error);
      }
    }
    setNewTitle('');
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (newTitle.length < minimumTitleLength) {
        inputRef.current?.focus();
      } else {
        setEditing(false);
        handleApiRequest();
      }
    }
  };

  const handleOnBlur = () => {
    if (newTitle.length < minimumTitleLength) {
      inputRef.current?.focus();
    } else {
      setEditing(false);
      handleApiRequest();
    }
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
        // autoFocus
        maxLength={20}
        ref={inputRef}
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
    <>
      <div
        className="px-3 flex items-center"
        onClick={() => setEditing(true)}
        onKeyUp={() => setEditing(true)}
        role="button"
        tabIndex={0}
        title="edit note title"
      >
        {title}
        {error && (
          <span className="text-yellow-400 ml-5" title="please try again">
            <IconContext.Provider value={iconSize}>
              <BiError />
            </IconContext.Provider>
          </span>
        )}
        {success && (
          <span
            className="text-purple-500 ml-5"
            title="title updated successfully"
          >
            <IconContext.Provider value={iconSize}>
              <BiCheckCircle />
            </IconContext.Provider>
          </span>
        )}
      </div>
    </>
  );
}

export default Title;
