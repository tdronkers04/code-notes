import { CopyBlock, atomOneLight } from "react-code-blocks";

export default function Note({ code }: { code: string }) {
  const copyBlockProps = {
    text: code,
    language: "javascript",
    showLineNumbers: true,
    theme: atomOneLight,
  };

  return (
    <div className="p-[10px] my-5 bg-zinc-800 rounded-md min-w-[800px] max-w-[1000px] min-h-[200px] max-h-[400px] grid grid-cols-5">
      <div className="m-1.5 bg-zinc-50  rounded-md text-black text-sm col-span-3 max-h-[350px] overflow-y-auto">
        <CopyBlock {...copyBlockProps} />
      </div>
      <div className="p-[5px] m-1.5 bg-zinc-950 text-lime-500 rounded-md col-span-2 max-h-[350px] overflow-y-auto">
        Analysis...
      </div>
    </div>
  );
}
