
"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { userService } from "@/app/services/userService";
import { IUser } from "@/types/user";

interface Props {
  accessToken: string | null;
}

export default function UserInitializer({ accessToken }: Props) {
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (!accessToken) {
        clearUser();
        return;
      }

      try {
        const user = (await userService.getMe(accessToken)) as IUser | null;

        if (!isMounted) return;

        if (user) {
          setUser(user);
        } else {
          clearUser();
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        if (isMounted) {
          clearUser();
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [accessToken, setUser, clearUser]);

  return null;
}
