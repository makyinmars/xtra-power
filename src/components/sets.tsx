import { trpc } from "src/utils/trpc";
import Spinner from "./spinner";

interface SProps {
  exerciseId: string;
}

const Sets = ({ exerciseId }: SProps) => {
  const { data, isLoading, isError } = trpc.set.getSetsByExerciseId.useQuery({
    exerciseId,
  });

  return (
    <div>
      {isLoading && <Spinner />}
      {isError && (
        <p className="text-center font-bold text-red-400 text-lg">
          Error loading workout
        </p>
      )}
      {data && (
        <div className="grid grid-cols-3 gap-2 place-items-center">
          <p className="font-bold">Reps</p>
          <p className="font-bold">Weigh</p>
          <p className="font-bold">Remove Set</p>
        </div>
      )}
      {data &&
        data.map((set, i) => (
          <div className="grid grid-cols-3 gap-2 place-items-center" key={i}>
            <p>{set.reps}</p>
            <p>{set.weight}</p>
            <button className="button w-14 md:w-8 h-8">Delete</button>
          </div>
        ))}
    </div>
  );
};

export default Sets;
