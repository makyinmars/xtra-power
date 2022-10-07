import { useForm, SubmitHandler } from "react-hook-form";

import { trpc } from "src/utils/trpc";

interface WorkoutInput {
  name: string;
  description: string;
}

const Workout = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkoutInput>();

  const createWorkout = trpc.workout.createWorkout.useMutation();

  const onSubmit: SubmitHandler<WorkoutInput> = async (data) => {
    try {
      const newWorkout = await createWorkout.mutateAsync(data);

      console.log(newWorkout);
    } catch {}
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="title-page">Workout</h1>
      <div className="flex flex-col max-w-xl mx-auto gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-2 shadow-lg drop-shadow-lg bg-sky-500 rounded"
        >
          <h2 className="subtitle-page">Create New Workout</h2>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Name"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic">Name is required.</p>
          )}

          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Description"
            {...register("description", { required: true })}
          />
          {errors.description && (
            <p className="text-red-500 text-xs italic">
              Description is required.
            </p>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </form>
        <div>
          <button>View My Workouts</button>
        </div>
      </div>
    </div>
  );
};

export default Workout;
