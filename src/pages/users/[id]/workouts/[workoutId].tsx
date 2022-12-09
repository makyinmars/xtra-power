import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import Menu from "src/components/menu";
import { trpc } from "src/utils/trpc";
import Spinner from "src/components/spinner";
import { ssrInit } from "src/utils/ssg";

const WorkoutId = ({workoutId}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, isLoading, isError } = trpc.workout.getPublicWorkout.useQuery({
    workoutId,
  });

  return (
    <Menu>
      {isLoading && <Spinner />}
      {isError && (
        <p className="text-center text-red-700 font-semibold">
          Something went wrong
        </p>
      )}
      {data ? (
        <div className="flex flex-col gap-4">
          <Head>
            <title>{data.name}</title>
          </Head>

          <h1 className="title-page text-2xl">Workout Name: {data.name}</h1>
          <p>Description: {data.description}</p>

          <div className="grid grid-cols-3 gap-4">
            {data.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="rounded shadow-lg p-4 bg-stone-200 bg-opacity-90 flex flex-col gap-2"
              >
                <h2 className="text-xl font-bold text-center">
                  {exercise.name}
                </h2>
                <p className="text-gray-500">{exercise.description}</p>

                {exercise.sets.map((set) => (
                  <div
                    key={set.id}
                    className="grid grid-cols-2 gap-4 rounded shadow-lg p-4 bg-stone-300 bg-opacity-80"
                  >
                    <p className="text-gray-500">Reps: {set.reps}</p>
                    <p className="text-gray-500">Weight: {set.weight} lbs</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Workout not found</p>
      )}
    </Menu>
  );
};

export default WorkoutId;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ workoutId: string }>
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  if (email) {
    const user = await ssg.user.getUserByEmail.fetch({ email });
    const workoutId = context.params?.workoutId as string;
    await ssg.workout.getPublicWorkout.prefetch({
      workoutId,
    });

    if (user) {
      return {
        props: {
          trpcState: ssg.dehydrate(),
          workoutId,
        },
      };
    } else {
      return {
        props: {
          trpcState: ssg.dehydrate(),
          workoutId: null,
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
        workoutId: null,
      },
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
