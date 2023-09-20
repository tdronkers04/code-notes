function DeleteModal({ noteId }: { noteId: string }) {
  return (
    <div className="bg-zinc-200 min-h-[200px] min-w-[300px] border-1 border-zinc-700 rounded-md grid grid-rows-2">
      <h1 className="bg-purple-500 p-3 rounded-t-md border-1 border-zinc-700 row-span-1 flex justify-center items-center">
        Are you sure you would like to delete this note?
      </h1>
      <div className="row-span-1 p-2 flex justify-center items-center">
        <button className="rounded-md w-[100px] mx-1 text-white bg-purple-500  py-2 border-2 border-zinc-700">
          Delete
        </button>
        <button className="rounded-md w-[100px] mx-1 text-zinc-700 bg-white  py-2 border-2 border-purple-500">
          Close
        </button>
      </div>
    </div>
  );
}

export default function ModalContent({
  type,
  noteId,
}: {
  type: string;
  noteId: string;
}) {
  switch (type) {
    // case "analysis":
    //   return <AnalysisModal noteId={noteId} />;
    // case "expand":
    //   return <ExpandModal noteId={noteId} />;
    // case "edit":
    //   return <EditModal noteId={noteId} />;
    case "delete":
      return <DeleteModal noteId={noteId} />;
  }
}
