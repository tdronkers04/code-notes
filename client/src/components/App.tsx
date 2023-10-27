import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
} from '@clerk/clerk-react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './LandingPage';
import ErrorPage from './ErrorPage';
import NotesProviderContainer from './NotesProviderContainer';

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/sign-in',
    element: (
      <div className="h-screen w-screen flex justify-center items-center">
        <SignIn
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/notes"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-purple-500',
              footerActionLink: 'text-purple-500',
              'cl-internal-b3fm6y': 'bg-purple-500',
            },
          }}
        />
      </div>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/sign-up',
    element: (
      <div className="h-screen w-screen flex justify-center items-center">
        <SignUp
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/notes"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-purple-500',
              footerActionLink: 'text-purple-500',
              'cl-internal-b3fm6y': 'bg-purple-500',
            },
          }}
        />
      </div>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/notes',
    element: (
      <>
        <SignedIn>
          <NotesProviderContainer />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    ),
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
