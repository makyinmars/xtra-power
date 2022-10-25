import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useQueryClient } from "@tanstack/react-query";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Menu from "src/components/menu";
import CreateWorkout from "src/components/create-workout";
import { useEffect } from "react";

const Workout = () => {
  const router = useRouter();

  const {data: session} = useSession()

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
