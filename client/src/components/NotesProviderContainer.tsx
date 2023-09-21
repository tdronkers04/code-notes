import { NotesProvider } from "../context/notesContext";
import Notes from "./Notes";

export default function NotesProviderContainer() {
  return (
    <NotesProvider>
      <Notes />
    </NotesProvider>
  );
}
