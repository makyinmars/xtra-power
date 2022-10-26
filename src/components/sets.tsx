import { trpc } from "src/utils/trpc";
import Spinner from "./spinner";

interface SProps {
  exerciseId: string;
}

const Sets = ({ exerciseId }: SProps) => {
  const { data, isLoading, isError } = trpc.set.getSetsByExerciseId.useQuery({
    exerciseId,
  });

  console.log("SET", data)

  return (
    <div>
      {isLoading && <Spinner />}
      {isError && (
        <p className="text-center font-bold text-red-400 text-lg">
          Error loading workout
        </p>
      )}
      {data &&
        data.map((set, i) => (
          <div className="grid grid-cols-3 gap-2" key={i}>
            <p>{set.reps}</p>
            <p>{set.weight}</p>
            <p>Delete</p>
          </div>
        ))}
    </div>
  );
};

export default Sets;
