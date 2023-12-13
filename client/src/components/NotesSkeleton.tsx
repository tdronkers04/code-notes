const NotesSkeleton = () => {
  return (
    <div className="w-screen h-full">
      <div className="w-[96%] h-[80px] -mb-4 flex justify-end items-end">
        <div className="rounded-full w-[45px] h-[45px] animate-pulse bg-zinc-700"></div>
      </div>
      <div className="flex flex-col justify-start items-center">
        <h1 className="py-4 text-3xl text-purple-500">Code Notes</h1>
        <ul>
          {new Array(1).fill(null).map((_, index) => (
            <li key={index}>
              <div className="my-5 bg-zinc-700 rounded-md w-[800px] h-[300px] animate-pulse"></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotesSkeleton;
