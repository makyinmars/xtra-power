import { getProviders, getSession } from "next-auth/react";
import Head from "next/head";
import type { GetServerSideProps } from "next";

import Menu from "src/components/menu";
import Spinner from "src/components/spinner";
import { trpc } from "src/utils/trpc";

const SelectTrainer = () => {
  const { data, isLoading, isError } = trpc.trainer.getTrainers.useQuery();

  return (
    <Menu>
      <Head>
        <title>Select Trainer</title>
      </Head>
      <div className="container mx-auto flex flex-col gap-4">
        {isLoading && <Spinner />}
        {isError && (
          <p className="text-center font-bold text-red-400 text-lg">
            Error loading trainers
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data &&
          data.map((trainer, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 p-2 shadow-lg drop-shadow-lg bg-stone-300 border-stone-300 border rounded cursor-pointer hover:bg-sky-600"
            >
              <h2>{trainer.name}</h2>
            </div>
          ))}
      </div>
    </Menu>
  );
};

export default SelectTrainer;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const user = (await prisma?.user.findUnique({
    where: {
      email: session?.user?.email as string | undefined,
    },
  }));

  if (!user?.clientId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};
