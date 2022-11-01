import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import { trpc } from "src/utils/trpc";
import Spinner from "src/components/spinner";
import Menu from "src/components/menu";
import CreateExercise from "src/components/create-exercise";
import CreateSet from "src/components/create-set";
import Sets from "src/components/sets";
import { ssrInit } from "src/utils/ssg";

const WorkoutId = ({
  email,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const { data, isError, isLoading } = trpc.workout.getWorkoutById.useQuery({
    id,
  });

  const user = utils.user.getUserByEmail.getData({
    email,
  });

  useEffect(() => {
    if (user) {
      if (user.trainerId) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router, user]);

  return (
    <Menu>
      <div className="container mx-auto p-4">
        {isLoading && <Spinner />}
        {isError && (
          <p className="text-center font-bold text-red-400 text-lg">
            Error loading workout
          </p>
        )}
        {data && (
          <div className="flex flex-col gap-4">
            <Head>
              <title>{data.name}</title>
            </Head>
            <h1 className="title-page">{data.name}</h1>
            <p className="text-center font-semibold text-lg">
              {data.description}
            </p>
            <CreateExercise workoutId={data.id} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex flex-col gap-4 p-4 border border-slate-200 rounded-md bg-stone-200 shadow-lg drop-shadow-lg"
                >
                  <h2 className="subtitle-page">{exercise.name}</h2>
                  <p>{exercise.description}</p>
                  <Sets exerciseId={exercise.id} />
                  <CreateSet exerciseId={exercise.id} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Menu>
  );
};

export default WorkoutId;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  const id = context.params?.id as string;

  await ssg.user.getUserByEmail.prefetch({
    email,
  });

  await ssg.workout.getWorkoutById.prefetch({
    id,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      email: email ?? null,
      id,
    },
  };
};
