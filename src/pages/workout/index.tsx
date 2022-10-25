import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

import Menu from "src/components/menu";
import CreateWorkout from "src/components/create-workout";
import { trpc } from "src/utils/trpc";

const Workout = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const utils = trpc.useContext();

  const user = utils.user.getUserByEmail.getData({
    email: session ? (session.user?.email as string) : "nice try",
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
      <Head>
        <title>Workout</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="title-page mb-4">Workout</h1>
        <div className="flex flex-col max-w-xl mx-auto gap-4">
          <CreateWorkout />
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
