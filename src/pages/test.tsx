import { GetServerSideProps } from "next/types";
import { useSession } from "next-auth/react";

import { getServerAuthSession } from "src/server/common/get-server-auth-session";

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
  } else {
    return {
      props: {
        session,
      },
    };
  }
};
