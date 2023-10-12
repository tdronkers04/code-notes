import DeleteModal from "./DeleteModal";
import AnalysisModal from "./AnalysisModal";

export default function ModalContent({
  type,
  noteId,
  handleClose,
}: {
  type: string;
  noteId: string;
  handleClose: () => void;
}) {
  switch (type) {
    case "analysis":
      return <AnalysisModal noteId={noteId} handleClose={handleClose} />;
    // case "expand":
    //   return <ExpandModal noteId={noteId} />;
    // case "edit":
    //   return <EditModal noteId={noteId} />;
    case "delete":
      return <DeleteModal noteId={noteId} handleClose={handleClose} />;
  }
}
