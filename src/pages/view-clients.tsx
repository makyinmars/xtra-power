import Head from "next/head";
import { useSession } from "next-auth/react";

import Menu from "src/components/menu";
import { trpc } from "src/utils/trpc";
import { useEffect } from "react";
import { useRouter } from "next/router";

const ViewClients = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const { data: session } = useSession();

  const user = utils.user.getUserByEmail.getData({
    email: session ? (session.user?.email as string) : "nice try",
  });

  useEffect(() => {
    if (user) {
      if (user.clientId) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router, user]);

  return (
    <Menu>
      <Head>
        <title>View Clients</title>
      </Head>
      <div className="container mx-auto flex flex-col gap-4">
        <h1 className="title-page">View Clients</h1>
      </div>
    </Menu>
  );
};

export default ViewClients;
