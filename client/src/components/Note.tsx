import { useMemo } from "react";
import { CopyBlock, atomOneLight } from "react-code-blocks";
import { BiTrash, BiPencil, BiExpand } from "react-icons/bi";
import { IconContext } from "react-icons";

export default function Note({ code }: { code: string }) {
  const copyBlockProps = {
    text: code,
    language: "javascript",
    showLineNumbers: true,
    theme: atomOneLight,
  };
  const iconSize = useMemo(() => ({ size: "1.5em" }), []);

  return (
    <div className="p-[10px] my-5 bg-zinc-700 rounded-md min-w-[1000px] max-w-[1200px] min-h-[200px] max-h-[400px] grid gap-4 grid-cols-12">
      <div className=" bg-zinc-50  rounded-md text-black text-sm col-span-6 max-h-[350px] overflow-y-auto overflow-x-auto">
        <CopyBlock {...copyBlockProps} />
      </div>
      <div className="p-[10px]  bg-zinc-950 text-lime-500 rounded-md col-span-5 max-h-[350px] overflow-y-auto">
        Analysis...
      </div>
      <div className="flex flex-col justify-start items-center col-span-1">
        <a className="py-2" title="expand note" href="/">
          <IconContext.Provider value={iconSize}>
            <BiExpand />
          </IconContext.Provider>
        </a>
        <a className="py-2" title="edit note" href="/">
          <IconContext.Provider value={iconSize}>
            <BiPencil />
          </IconContext.Provider>
        </a>
        <a className="py-2" title="delete note" href="/">
          <IconContext.Provider value={iconSize}>
            <BiTrash />
          </IconContext.Provider>
        </a>
      </div>
    </div>
  );
}
