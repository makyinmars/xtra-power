import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect } from "react";

import Menu from "src/components/menu";
import Spinner from "src/components/spinner";
import { trpc } from "src/utils/trpc";

const SelectTrainer = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const { data, isLoading, isError } = trpc.trainer.getTrainers.useQuery();

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
        <title>Select Trainer</title>
      </Head>
      <div className="container mx-auto flex flex-col gap-4">
        <h1 className="title-page">View Trainer</h1>
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
              className="flex flex-col gap-1 p-2 shadow-lg drop-shadow-lg bg-stone-300 border-stone-300 border rounded cursor-pointer hover:bg-sky-600"
            >
              <h2>{trainer.name}</h2>
            </div>
          ))}
      </div>
    </Menu>
  );
};

export default SelectTrainer;
