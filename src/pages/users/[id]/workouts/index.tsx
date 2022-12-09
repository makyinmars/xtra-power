import { useRouter } from "next/router";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import { trpc } from "src/utils/trpc";
import Menu from "src/components/menu";
import Spinner from "src/components/spinner";
import { ssrInit } from "src/utils/ssg";

const Workouts = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const { data, isLoading, isError } = trpc.workout.getPublicWorkouts.useQuery({
    id,
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
            <title>
              {data[0]?.user?.name}
              {`'`}s Workouts
            </title>
          </Head>
          <h1 className="title-page text-2xl">
            {data[0]?.user?.name}
            {`'`}s Workouts
          </h1>
          <div className="grid grid-cols-3 gap-4">
            {data.map((workout) => (
              <div
                key={workout.id}
                className="rounded shadow-lg p-4 bg-stone-200 bg-opacity-90"
              >
                <h2 className="text-xl font-bold text-center">
                  {workout.name}
                </h2>
                <p className="text-gray-500">{workout.description}</p>
                <div className="flex justify-center">
                  <button
                    className="button p-1 w-full text-sm"
                    onClick={() =>
                      router.push(`/users/${id}/workouts/${workout.id}`)
                    }
                  >
                    View Workout
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Head>
          <title>Workouts</title>
        </Head>
      )}
    </Menu>
  );
};

export default Workouts;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  if (email) {
    const user = await ssg.user.getUserByEmail.fetch({ email });
    const id = context.params?.id as string;
    await ssg.workout.getPublicWorkouts.prefetch({
      id,
    });

    if (user) {
      return {
        props: {
          trpcState: ssg.dehydrate(),
          id,
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
