import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
  UserButton,
} from "@clerk/clerk-react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./LandingPage";
import ErrorPage from "./ErrorPage";

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

function ProtectedPage() {
  return (
    <>
      <SignedIn>
        <h1>Protected Page</h1>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "sign-in",
    element: (
      <SignIn path="/sign-in" signUpUrl="/sign-up" redirectUrl="/notes" />
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "sign-up",
    element: (
      <SignUp path="/sign-up" signInUrl="/sign-in" redirectUrl="/notes" />
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/notes",
    element: <ProtectedPage />,
    errorElement: <ErrorPage />,
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
