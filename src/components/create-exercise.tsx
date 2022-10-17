import { useForm, SubmitHandler } from "react-hook-form";

interface ExerciseInput {
  name: string;
  description: string;
}

const CreateExercise = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseInput>();
  const onSubmit: SubmitHandler<ExerciseInput> = async (data) => {
    try {
      console.log(data);
    } catch { }
  };
  return (
      <div className="container flex flex-col max-w-xl mx-auto gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-2 shadow-lg drop-shadow-lg rounded bg-stone-200"
        >
          <h2 className="subtitle-page">Create New Exercise</h2>
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
            className="button w-full"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
  );
};

export default CreateExercise;
