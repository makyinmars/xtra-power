import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import Menu from "src/components/menu";
import EditUser from "src/components/edit-user";
import { ssrInit } from "src/utils/ssg";
import { trpc } from "src/utils/trpc";

const User = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const data = utils.user.getUserByEmail.getData({ email });

  const deleteClient = trpc.client.deleteClient.useMutation({
    async onSuccess() {
      await utils.user.getUserByEmail.invalidate();
      await utils.auth.getSession.invalidate();
      await router.push("/thank-you");
    },
  });

  const deleteTrainer = trpc.trainer.deleteTrainer.useMutation({
    async onSuccess() {
      await utils.user.getUserByEmail.invalidate();
      await utils.auth.getSession.invalidate();
      await router.push("/thank-you");
    },
  });

  const onDeleteUser = async (id: string) => {
    try {
      if (data?.clientId) {
        await deleteClient.mutateAsync({ id });
      } else if (data?.trainerId) {
        await deleteTrainer.mutateAsync({ id });
      }
    } catch {}
  };

  return (
    <Menu>
      <Head>
        <title>User</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="title-page">User</h1>
      </div>
      {data && (
        <div className="flex flex-col gap-4">
          <h3 className="self-center text-lg">
            <span className="font-bold">Name:</span>{" "}
            <span className="font-semibold">{data.name}</span>
          </h3>
          {/* Pass the user */}
          <EditUser email={email as string} />
          <div className="flex justify-center">
            <button
              className="button w-60"
              onClick={() => onDeleteUser(data.id)}
            >
              Delete User
            </button>
          </div>
        </div>
      )}
    </Menu>
  );
};

export default User;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  if (email) {
    const user = await ssg.user.getUserByEmail.fetch({
      email,
    });

    if (user?.clientId || user?.trainerId) {
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
        },
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  } else {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {
        trpcState: ssg.dehydrate(),
        email: null,
      },
    };
  }
};
