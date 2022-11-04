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

  const { data } = trpc.user.getUserByEmail.useQuery({
    email,
  });

  const deleteUser = trpc.user.deleteUser.useMutation();

  const onDeleteUser = async (id: string) => {
    try {
      if (data?.clientId) {
        const user = await deleteUser.mutateAsync({ id });
        if (user) {
          router.push("/");
        }
      } else if (data?.trainerId) {
        const user = await deleteUser.mutateAsync({ id });
        if (user) {
          router.push("/");
        }
      }
    } catch { }
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
          <EditUser userId={data.id} name={data.name as string} />
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

  await ssg.user.getUserByEmail.prefetch({
    email,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      email: email ?? null,
    },
  };
};
