import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./LandingPage";
import ErrorPage from "./ErrorPage";
import Auth from "./Auth";
import Notes from "./Notes";

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/sign-in",
    element: (
      <SignIn path="/sign-in" signUpUrl="/sign-up" redirectUrl="/notes" />
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/sign-up",
    element: (
      <SignUp path="/sign-up" signInUrl="/sign-in" redirectUrl="/notes" />
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/notes",
    element: (
      <>
        <SignedIn>
          <Notes />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    //delete this route before deploying
    path: "protected-route",
    element: <Auth />,
  },
]);

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}

export default App;
