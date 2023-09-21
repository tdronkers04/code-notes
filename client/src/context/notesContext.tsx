import React, { createContext } from "react";
import { NoteType, NotesContextType } from "../@types/notes";

export const NotesContext = createContext<NotesContextType | null>(null);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = React.useState<NoteType[]>([]);

  const updateNotes = (notes: NoteType[]) => {
    setNotes([...notes]);
  };

  const addNote = (newNote: NoteType) => {
    setNotes([...notes, newNote]);
  };

  const deleteNote = (noteId: string) => {
    setNotes([...notes.filter((note) => note.id !== noteId)]);
  };

  return (
    <NotesContext.Provider value={{ notes, updateNotes, addNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};
