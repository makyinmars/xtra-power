import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { getProviders, getSession } from "next-auth/react";
import Spinner from "src/components/spinner";
import Head from "next/head";

import { trpc } from "src/utils/trpc";
import Menu from "src/components/menu";

const ViewWorkouts = () => {
  const router = useRouter();
  const { data, isError, isLoading } = trpc.workout.getWorkouts.useQuery();

  return (
    <Menu>
      <Head>
        <title>View Workouts</title>
      </Head>
      <div className="container mx-auto p-4 flex flex-col gap-4">
        <h1 className="title-page">Workouts</h1>
        {isLoading && <Spinner />}
        {isError && (
          <p className="text-center font-bold text-red-400 text-lg">
            Error loading workouts
          </p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data &&
            data.map((workout, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 p-2 shadow-lg drop-shadow-lg bg-stone-300 border-stone-300 border rounded cursor-pointer hover:bg-sky-600"
                onClick={() => router.push(`/workout/${workout.id}`)}
              >
                <h2 className="subtitle-page">{workout.name}</h2>
                <p>{workout.description}</p>
              </div>
            ))}
        </div>
      </div>
    </Menu>
  );
};

export default ViewWorkouts;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

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
