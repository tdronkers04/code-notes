/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface NoteType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: any;
  title: string;
  code: string;
  analysis?: any;
}

export type NotesContextType = {
  notes: NoteType[];
  updateNotes: (notes: NoteType[]) => void;
  addNote: (note: NoteType) => void;
  deleteNote: (noteId: string) => void;
};

export type AnalysisType = {
  language: string;
  paradigm: string;
  summary: string;
  recommendation: string;
};
