import DeleteModal from "./DeleteModal";

export default function ModalContent({ type, noteId, handleClose }) {
  switch (type) {
    // case "analysis":
    //   return <AnalysisModal noteId={noteId} />;
    // case "expand":
    //   return <ExpandModal noteId={noteId} />;
    // case "edit":
    //   return <EditModal noteId={noteId} />;
    case "delete":
      return <DeleteModal noteId={noteId} handleClose={handleClose} />;
  }
}
