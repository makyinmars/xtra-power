import { GetServerSideProps } from "next/types";
import { useSession } from "next-auth/react";

import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { User } from "@prisma/client";

const Test = () => {
  const { data: session } = useSession();
  console.log("DATA", session);
  return <div>Test</div>;
};

export default Test;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = (await prisma?.user.findUnique({
    where: {
      email: session?.user?.email as string | undefined,
    },
  })) as User;

  console.log("user", user)

  if (user.trainerId || user.clientId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
