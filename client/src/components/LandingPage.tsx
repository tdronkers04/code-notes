import { useAuth } from '@clerk/clerk-react';
import OpenAiLogo from '../assets/openai-white-lockup.png';

function LandingPage() {
  const { userId } = useAuth();
  const path = userId ? '/notes' : '/sign-in';
  return (
    <div className="w-screen h-screen text-zinc-50 flex justify-center items-center">
      <div className="w-full max-w-[500px] mx-auto">
        <h1 className="text-4xl mb-3 text-purple-500 text-center underline">
          Code Notes
        </h1>
        <h2 className="text-xl my-4 text-zinc-50/60 text-center">
          An AI-Powered Notebook for keeping track of your favorite code
          snippets
        </h2>
        <div className="flex justify-center my-4">
          <a href={path}>
            <button className="bg-purple-500 px-4 py-2 rounded-md text-xl">
              Get Started
            </button>
          </a>
        </div>
        <div className="flex justify-center">
          <p className="text-base">powered by</p>
          <img className="px-2 object-scale-down h-6" src={OpenAiLogo} />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
