import type { GetServerSideProps } from "next";
import { getProviders, getSession } from "next-auth/react";
import { useRouter } from "next/router";

import Menu from "src/components/menu";
import CreateWorkout from "src/components/create-workout";

const Workout = () => {
  const router = useRouter();

  return (
    <Menu>
      <div className="container mx-auto p-4">
        <h1 className="title-page mb-4">Workout</h1>
        <div className="flex flex-col max-w-xl mx-auto gap-4">
          <CreateWorkout />
          <div className="flex justify-center">
            <button
              className="button w-full"
              onClick={() => router.push("/view-workouts")}
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
