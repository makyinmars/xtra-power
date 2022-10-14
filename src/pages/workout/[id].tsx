import { useRouter } from "next/router";

import { trpc } from "src/utils/trpc";

const WorkoutId = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, isError, isLoading } = trpc.workout.getWorkoutById.useQuery({
    id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {data && (
        <div className="flex flex-col gap-4">
          <h1 className="title-page">{data.name}</h1>
          <p className="text-center font-semibold text-lg">
            {data.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex flex-col gap-4 p-4 border border-slate-400 rounded-md bg-slate-400 shadow-lg drop-shadow-lg"
              >
                <h2 className="subtitle-page">{exercise.name}</h2>
                <p>{exercise.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutId;
