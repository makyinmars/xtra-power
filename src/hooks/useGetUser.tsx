import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useGetUser = () => {
  const [user, setUser] = useState<User>();

  const { data: session } = useSession();

  useEffect(() => {
    //
  }, []);

  return {
    user,
  };
};
