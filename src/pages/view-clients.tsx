import Head from "next/head";
import { useSession } from "next-auth/react";

import Menu from "src/components/menu";
import { trpc } from "src/utils/trpc";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Spinner from "src/components/spinner";

const ViewClients = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const { data: session } = useSession();

  const user = utils.user.getUserByEmail.getData({
    email: session ? (session.user?.email as string) : "nice try",
  });

  const {
    data: clientsData,
    isLoading: clientsIsLoading,
    isError: clientsIsError,
  } = trpc.trainer.getTrainerClients.useQuery({
    trainerId: user ? (user.trainerId as string) : "nice try",
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
        {clientsIsLoading && <Spinner />}
        {clientsIsError && (
          <p className="text-center font-bold text-red-400 text-lg">
            Error loading trainers
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {clientsData &&
          clientsData.map((client, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 p-2 shadow-lg drop-shadow-lg bg-stone-300 rounded cursor-pointer hover:bg-gray-600 hover:text-slate-200"
            >
              <h2 className="text-lg">
                <span className="font-bold">Client:</span> {client.name}
              </h2>
            </div>
          ))}
      </div>
    </Menu>
  );
};

export default ViewClients;
