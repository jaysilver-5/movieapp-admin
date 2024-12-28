// utils/withAuth.tsx

import { RedirectToSignIn, useAuth } from "@clerk/nextjs";

export const withAuth = (Component: React.FC) => {
  return (props: any) => {
    const { isSignedIn } = useAuth();

    if (!isSignedIn) {
      return <RedirectToSignIn />;
    }

    return <Component {...props} />;
  };
};
