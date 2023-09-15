import { useAuth } from "@clerk/clerk-react";

function LandingPage() {
  const { userId } = useAuth();
  const path = userId ? "/notes" : "/sign-in";
  return (
    <div className="w-screen h-screen text-zinc-50 flex justify-center items-center">
      <div className="w-full max-w-[500px] mx-auto">
        <h1 className="text-4xl mb-3">
          An AI-Powered Notebook for Code Snippets
        </h1>
        <p className="text-xl text-zinc-50/60 mb-3">
          This app will help you keep track of helpful code snippets
        </p>
        <div>
          <a href={path}>
            <button className="bg-purple-500 px-4 py-2 rounded-lg text-xl">
              get started
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
