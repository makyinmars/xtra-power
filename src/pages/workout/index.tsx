import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import Menu from "src/components/menu";
import CreateWorkout from "src/components/create-workout";
import { trpc } from "src/utils/trpc";
import { ssrInit } from "src/utils/ssg";

const Workout = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const utils = trpc.useContext();

  const user = utils.user.getUserByEmail.getData({
    email,
  });

  return (
    <Menu>
      <Head>
        <title>Workout</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="title-page mb-4">Workout</h1>
        <div className="flex flex-col max-w-xl mx-auto gap-4">
          {user && (
            <CreateWorkout
              clientId={user ? (user.clientId as string) : "nice try"}
            />
          )}
          <div className="flex justify-center">
            <button
              className="button w-full"
              onClick={() => router.push("/workout/view-workouts")}
            >
              View My Workouts
            </button>
          </div>
        </div>
      </div>
    </Menu>
  );
};

export default Workout;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  if (email) {
    const user = await ssg.user.getUserByEmail.fetch({ email });

    if (user?.clientId) {
      return {
        props: {
          trpcState: ssg.dehydrate(),
          email,
        },
      };
    } else {
      return {
        props: {
          trpcState: ssg.dehydrate(),
          email: null,
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
        email: null,
      },
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
