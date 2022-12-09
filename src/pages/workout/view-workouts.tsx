import { useEffect } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import Spinner from "src/components/spinner";
import { trpc } from "src/utils/trpc";
import Menu from "src/components/menu";
import { ssrInit } from "src/utils/ssg";

const ViewWorkouts = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const { data, isError, isLoading } = trpc.workout.getWorkouts.useQuery();

  const deleteWorkout = trpc.workout.deleteWorkoutById.useMutation({
    async onSuccess() {
      await utils.workout.getWorkouts.invalidate();
    },
  });

  const onDeleteWorkout = async (id: string) => {
    try {
      await deleteWorkout.mutateAsync({ id });
    } catch {}
  };

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
                className="flex flex-col gap-1 p-2 shadow-lg drop-shadow-lg bg-slate-400 rounded"
              >
                <h2 className="text-2xl font-bold self-center">
                  {workout.name}
                </h2>
                <p className="text-xl">{workout.description}</p>
                <button
                  onClick={() => router.push(`/workout/${workout.id}`)}
                  className="button w-full p-1"
                >
                  View Workout
                </button>
                <button
                  onClick={() => onDeleteWorkout(workout.id)}
                  className="button w-full p-1"
                >
                  Delete Workout
                </button>
              </div>
            ))}
        </div>
      </div>
    </Menu>
  );
};

export default ViewWorkouts;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  if (email) {
    const user = await ssg.user.getUserByEmail.fetch({ email });
    if (user?.clientId) {
      await ssg.workout.getWorkouts.prefetch();

      return {
        props: {
          trpcState: ssg.dehydrate(),
          email: email ?? null,
        },
      };
    } else {
      return {
        props: {
          trpcState: ssg.dehydrate(),
          id: null,
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
        id: null,
      },
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
