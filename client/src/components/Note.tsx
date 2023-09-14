export default function Note({ code }: { code: string }) {
  return (
    <div className="bg-black-100 text-red-500 py-[10px] border border-sky-500 max-w-[600px]">
      <h3>Note:</h3>
      <code>{code}</code>
    </div>
  );
}
