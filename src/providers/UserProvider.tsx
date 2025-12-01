"use client";

import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { IUser } from "@/types/user";

interface Props {
  user: IUser | null,
  children: ReactNode;
}

export default function UserProvider({ user, children }: Props) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
}
