import Head from "next/head";

import Menu from "src/components/menu";
import { trpc } from "src/utils/trpc";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Spinner from "src/components/spinner";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { ssrInit } from "src/utils/ssg";

const ViewClients = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const utils = trpc.useContext();
  const user = utils.user.getUserByEmail.getData({
    email,
  });

  const { data, isLoading, isError } = trpc.trainer.getTrainerClients.useQuery({
    trainerId: user ? (user.trainerId as string) : "nice try",
  });

  useEffect(() => {
    if (!email) {
      router.push("/");
    }

    if (user) {
      if (user.clientId) {
        router.push("/");
      }
    }
  }, [email, router, user]);

  return (
    <Menu>
      <Head>
        <title>View Clients</title>
      </Head>
      <div className="container mx-auto flex flex-col gap-4">
        <h1 className="title-page">View Clients</h1>
        {isLoading && <Spinner />}
        {isError && (
          <p className="text-center font-bold text-red-400 text-lg">
            Error loading trainers
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data &&
          data.map((client, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 p-2 shadow-lg drop-shadow-lg bg-stone-300 rounded cursor-pointer hover:bg-gray-600 hover:text-slate-200"
            >
              <h2 className="text-lg">
                <span className="font-bold">Client:</span> {client.name}{" "}
              </h2>
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

  await ssg.user.getUserByEmail.prefetch({
    email,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      email: email ?? null,
    },
  };
};
