import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { RotatingLines } from "react-loader-spinner";

export default function AnalysisModal({
  noteId,
  handleClose,
}: {
  noteId: string;
  handleClose: () => void;
}) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const response = await fetch(
          `http://localhost:8000/notes/${noteId}/analysis`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              mode: "cors",
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(
            `Something went wrong fetching the analysis for note ${noteId}`
          );
        }

        const result = await response.json();
        setAnalysis(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else if (typeof err === "string") {
          setError({ message: err } as Error);
        }
      }
      setLoading(false);
    };
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="bg-zinc-200 h-[200px] w-[500px] border-1 border-zinc-700 rounded-md grid grid-rows-2">
        <h1 className="bg-purple-500 p-3 rounded-t-md border-1 border-zinc-700 row-span-1 flex justify-center items-center">
          Loading...
        </h1>
        <div className="row-span-1 p-2 flex justify-center items-center">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="70"
            visible={true}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-200 h-[200px] w-[500px] border-1 border-zinc-700 rounded-md grid grid-rows-2">
        <h1 className="bg-purple-500 p-3 rounded-t-md border-1 border-zinc-700 row-span-1 flex justify-center items-center">
          Error: {error.message}
        </h1>
        <div className="row-span-1 p-2 flex justify-center items-center">
          <button
            className="rounded-md w-[100px] mx-1 text-purple-500 bg-white  py-2 border-2 border-zinc-700"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-200 h-[200px] w-[500px] border-1 border-zinc-700 rounded-md grid grid-rows-2">
      ANALYSIS: {analysis}
    </div>
  );
}