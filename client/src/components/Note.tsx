import { useMemo } from "react";
import { CopyBlock, atomOneLight } from "react-code-blocks";
import { BiTrash, BiPencil, BiExpand, BiBot } from "react-icons/bi";
import { IconContext } from "react-icons";

export default function Note({ code, title }: { code: string; title: string }) {
  const copyBlockProps = {
    text: code,
    language: "javascript",
    showLineNumbers: true,
    theme: atomOneLight,
  };
  const iconSize = useMemo(() => ({ size: "1.3em" }), []);

  return (
    <div className="my-5 bg-zinc-700 rounded-md w-[800px] h-[300px]">
      <div className="h-[40px] flex justify-between items-center text-zinc-50">
        <div className="px-3">{title}</div>
        <div className="px-3 flex justify-around w-[150px]">
          <a className="" title="note analysis" href="/">
            <IconContext.Provider value={iconSize}>
              <BiBot />
            </IconContext.Provider>
          </a>
          <a className="" title="expand note" href="/">
            <IconContext.Provider value={iconSize}>
              <BiExpand />
            </IconContext.Provider>
          </a>
          <a className="" title="edit note" href="/">
            <IconContext.Provider value={iconSize}>
              <BiPencil />
            </IconContext.Provider>
          </a>
          <a className="" title="delete note" href="/">
            <IconContext.Provider value={iconSize}>
              <BiTrash />
            </IconContext.Provider>
          </a>
        </div>
      </div>
      <div className="h-[260px] p-2 overflow-auto overscroll-none">
        <div className="min-h-full bg-zinc-50 rounded-md text-sm">
          <CopyBlock {...copyBlockProps} />
        </div>
      </div>
    </div>
  );
}
