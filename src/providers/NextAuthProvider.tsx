"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface NextAuthProviderProps {
  children: ReactNode;
  session?: Session | null; // session prop
}

const NextAuthProvider: React.FC<NextAuthProviderProps> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default NextAuthProvider;
