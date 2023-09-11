import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.error?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  return (
    <div
      id="error-page"
      className="w-screen h-screen bg-black text-white flex justify-center items-center"
    >
      <div className="w-full max-w-[500px] mx-auto">
        <h1 className="text-5xl mb-3">Ooops!</h1>
        <p className="text-xl text-white/60 mb-3">
          Sorry, an unexpected error has occurred:
        </p>
        <div>
          <i>{errorMessage}</i>
        </div>
      </div>
    </div>
  );
}
