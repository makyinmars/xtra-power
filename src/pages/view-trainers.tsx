import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect } from "react";

import Menu from "src/components/menu";
import Spinner from "src/components/spinner";
import { trpc } from "src/utils/trpc";
import { ssrInit } from "src/utils/ssg";

const SelectTrainer = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const { data, isLoading, isError } = trpc.trainer.getTrainers.useQuery();

  const addTrainer = trpc.client.addTrainer.useMutation({
    async onSuccess() {
      await utils.user.getUserByEmail.invalidate();
      await utils.trainer.getTrainers.invalidate();
      // Fix this function
      /* await utils.client.getTrainer.invalidate(); */
    },
  });

  const removeTrainer = trpc.client.removeTrainer.useMutation({
    async onSuccess() {
      await utils.user.getUserByEmail.invalidate();
      await utils.trainer.getTrainers.invalidate();
      // Fix this function
      /* await utils.client.getTrainer.invalidate(); */
    },
  });

  const user = utils.user.getUserByEmail.getData({
    email,
  });

  const {
    data: trainerData,
    isLoading: trainerIsLoading,
    isError: trainerIsError,
  } = trpc.client.getTrainer.useQuery({
    email,
  });

  const onTrainerSelect = async (trainerId: string) => {
    try {
      if (user) {
        await addTrainer.mutateAsync({
          userId: user.id as string,
          trainerId,
        });
      }
    } catch {}
  };

  const onTrainerRemove = async (trainerId: string) => {
    try {
      if (user) {
        const trainer = await removeTrainer.mutateAsync({
          userId: user.id as string,
          trainerId,
        });

        if (trainer) {
          router.push("/");
        }
      }
    } catch {}
  };

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
        <title>Select Trainer</title>
      </Head>
      <div className="flex flex-col gap-2">
        <div className="container mx-auto flex flex-col gap-4">
          <h2 className="title-page">My Trainer</h2>
          {trainerIsLoading && <Spinner />}
          {trainerIsError && (
            <p className="text-center font-bold text-red-400 text-lg">
              You do not have a trainer yet
            </p>
          )}

          {trainerData && (
            <div className="flex flex-col gap-2 bg-slate-700 text-slate-200 mx-auto p-2 rounded">
              <p className="text-center ext-lg">
                Your trainer is{" "}
                <span className="font-bold">{trainerData.name}</span>
              </p>
              <p className="text-center text-lg">
                Your trainer{`'`}s email is{" "}
                <span className="font-bold">{trainerData.email}</span>
              </p>
              <div className="flex justify-center">
                <button
                  className="button bg-slate-200 text-slate-700 w-full p-1 hover:bg-slate-300 hover:text-slate-800"
                  onClick={() => onTrainerRemove(trainerData.id)}
                >
                  Remove Trainer
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="container mx-auto flex flex-col gap-4">
          <h2 className="title-page">View Trainers</h2>
          {isLoading && <Spinner />}
          {isError && (
            <p className="text-center font-bold text-red-400 text-lg">
              Error loading trainers
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data &&
            data.map((trainer, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 p-2 shadow-lg drop-shadow-lg bg-stone-100 border-stone-300 border rounded"
              >
                <h2 className="text-lg">
                  <span className="font-bold">Trainer:</span> {trainer.name}
                </h2>
                <button
                  className="button w-full h-10"
                  onClick={() => onTrainerSelect(trainer.id)}
                >
                  Select
                </button>
              </div>
            ))}
        </div>
      </div>
    </Menu>
  );
};

export default SelectTrainer;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  await ssg.user.getUserByEmail.prefetch({
    email,
  });

  await ssg.client.getClient.prefetch({
    email,
  });

  await ssg.client.getTrainer.prefetch({
    email,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      email: email ?? null,
    },
  };
};
