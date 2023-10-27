import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { RotatingLines } from 'react-loader-spinner';
import { AnalysisType } from '../../@types/notes';
import OpenAiLogo from '../../assets/openai-white-lockup.png';

const API_URL = import.meta.env.VITE_API_URL;

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
  const [analysis, setAnalysis] = useState<AnalysisType | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const response = await fetch(
          `${API_URL}/api/notes/${noteId}/analysis`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              mode: 'cors',
            },
          },
        );

        if (response.status !== 200) {
          throw new Error(
            `Something went wrong fetching the analysis for note ${noteId}`,
          );
        }

        const result = await response.json();
        setAnalysis(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else if (typeof err === 'string') {
          setError({ message: err } as Error);
        }
      }
      setLoading(false);
    };
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="bg-zinc-200  w-[1000px] h-[600px] border-1 border-zinc-700 rounded-md grid grid-rows-8">
        <div className="row-span-1 bg-purple-500 h-[100px] border-1 border-zinc-700 rounded-t-md p-3 flex flex-col justify-center items-center">
          <h1 className="text-xl m-2">Analysis</h1>
          <div className="flex">
            <p className="text-sm">powered by</p>
            <img className="px-2 object-scale-down h-5" src={OpenAiLogo} />
          </div>
        </div>

        <div className="row-span-6 p-3 flex justify-center items-center">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="70"
            visible={true}
          />
        </div>

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
    <div className="bg-zinc-200  w-[1000px] h-[600px] border-1 border-zinc-700 rounded-md grid grid-rows-8">
      <div className="row-span-1 bg-purple-500 h-[100px] border-1 border-zinc-700 rounded-t-md p-3 flex flex-col justify-center items-center">
        <h1 className="text-xl m-2">Analysis</h1>
        <div className="flex">
          <p className="text-sm">powered by</p>
          <img className="px-2 object-scale-down h-5" src={OpenAiLogo} />
        </div>
      </div>

      <div className="row-span-6 p-3">
        <div className="grid grid-rows-8 gap-5 text-purple-500">
          <div className="row-span-1">
            <span className="text-zinc-900 font-semibold">Language: </span>
            {analysis?.language}
          </div>
          <div className="row-span-1">
            <span className="text-zinc-900 font-semibold">Paradigm: </span>
            {analysis?.paradigm}
          </div>
          <div className="row-span-3 max-h-[150px] overflow-y-auto">
            <span className="text-zinc-900 font-semibold">Summary: </span>
            {analysis?.summary}
          </div>
          <div className="row-span-3 max-h-[150px] overflow-y-auto">
            <span className="text-zinc-900 font-semibold">
              Recommendation:{' '}
            </span>
            {analysis?.recommendation}
          </div>
        </div>
      </div>

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
