import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { getProviders, getSession } from "next-auth/react";

import { trpc } from "src/utils/trpc";
import Spinner from "src/components/spinner";
import Menu from "src/components/menu";
import CreateExercise from "src/components/create-exercise";

const WorkoutId = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, isError, isLoading } = trpc.workout.getWorkoutById.useQuery({
    id,
  });

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
            <h1 className="title-page">{data.name}</h1>
            <p className="text-center font-semibold text-lg">
              {data.description}
            </p>
            <CreateExercise workoutId={data.id} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex flex-col gap-4 p-4 border border-slate-200 rounded-md bg-stone-200 shadow-lg drop-shadow-lg"
                >
                  <h2 className="subtitle-page">{exercise.name}</h2>
                  <p>{exercise.description}</p>
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
