import Head from "next/head";
import { useRouter } from "next/router";

import Menu from "src/components/menu";
import { trpc } from "src/utils/trpc";
import Spinner from "src/components/spinner";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { ssrInit } from "src/utils/ssg";

const ViewClients = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const utils = trpc.useContext();

  const {
    data: dataMyClients,
    isLoading: isLoadingMyClients,
    isError: isErrorMyClients,
  } = trpc.trainer.getMyClients.useQuery({
    email,
  });

  const removeClient = trpc.trainer.removeClient.useMutation({
    async onSuccess() {
      await utils.trainer.getMyClients.invalidate();
    },
  });
  const addClient = trpc.trainer.addClient.useMutation({
    async onSuccess() {
      await utils.trainer.getMyClients.invalidate();
    },
  });

  const onAddClient = async (userId: string, clientId: string) => {
    try {
      await addClient.mutateAsync({ userId, clientId });
    } catch {}
  };

  const onRemoveClient = async (userId: string) => {
    try {
      await removeClient.mutateAsync({ userId });
    } catch {}
  };

  const { data: clients } = trpc.trainer.getClients.useQuery();

  return (
    <Menu>
      <Head>
        <title>View Clients</title>
      </Head>
      <h1 className="title-page text-3xl">My Clients</h1>
      {isLoadingMyClients && <Spinner />}
      {isErrorMyClients && (
        <p className="text-red-400">There was an error loading your clients.</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {dataMyClients &&
          dataMyClients.map((client, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 p-2 shadow-lg drop-shadow-lg bg-stone-300 rounded cursor-pointer"
            >
              <h2 className="text-lg">
                <span className="font-bold">Client:</span> {client.name}{" "}
              </h2>
              <div className="flex justify-center flex-col gap-2">
                <button
                  className="button text-sm p-1 w-full"
                  onClick={() => router.push(`/users/${client.id}/workouts`)}
                >
                  View Workouts
                </button>
                <button
                  className="button text-sm p-1 w-full"
                  onClick={() => onRemoveClient(client.id)}
                >
                  Remove Client
                </button>
              </div>
            </div>
          ))}
      </div>

      <h1 className="title-page text-3xl">All Clients</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {clients &&
          clients.map((client, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 p-2 shadow-lg drop-shadow-lg bg-stone-300 rounded cursor-pointer hover:bg-gray-600 hover:text-slate-200"
            >
              <h2 className="text-lg">{client.name} </h2>
              <button
                className="button p-1"
                onClick={() =>
                  onAddClient(client.id, client.clientId as string)
                }
              >
                Add Client
              </button>
            </div>
          ))}
      </div>
    </Menu>
  );
};

export default ViewClients;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  if (email) {
    const user = await ssg.user.getUserByEmail.fetch({ email });

    if (user?.trainerId) {
      await ssg.trainer.getMyClients.prefetch({
        email,
      });
      return {
        props: {
          trpcState: ssg.dehydrate(),
          email,
        },
      };
    } else {
      return {
        props: {
          trpcState: ssg.dehydrate(),
          email: null,
        },
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  } else {
    return {
      props: {
        trpcState: ssg.dehydrate(),
        email: null,
      },
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
