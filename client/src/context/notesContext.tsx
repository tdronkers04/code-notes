import React, { createContext } from 'react';
import { NoteType, NotesContextType } from '../@types/notes';

export const NotesContext = createContext<NotesContextType | null>(null);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = React.useState<NoteType[]>([]);

  const updateNotes = (notes: NoteType[]) => {
    setNotes([...notes]);
  };

  const addNote = (newNote: NoteType) => {
    setNotes([...notes, newNote]);
  };

  const deleteNote = (noteId: string) => {
    setNotes([...notes.filter((note: NoteType) => note.id !== noteId)]);
  };

  const editNote = (updatedNote: NoteType) => {
    setNotes(
      notes.map((note: NoteType) => {
        if (note.id === updatedNote.id) return updatedNote;
        return note;
      }),
    );
  };

  return (
    <NotesContext.Provider
      value={{ notes, updateNotes, addNote, deleteNote, editNote }}
    >
      {children}
    </NotesContext.Provider>
  );
};
