export default function Note({ code }: { code: string }) {
  return (
    <div className="p-[10px] my-5 bg-zinc-800 rounded-md min-w-[800px] max-w-[1000px] min-h-[200px] max-h-[400px] grid grid-cols-5">
      <code className="p-[5px] m-1 bg-white  rounded-md text-black col-span-3 max-h-[350px] overflow-y-auto">
        {code}
      </code>
      <div className="p-[5px] m-1 bg-zinc-950 text-lime-500 rounded-md col-span-2 max-h-[350px] overflow-y-auto">
        Analysis...
      </div>
    </div>
  );
}
