import Head from "next/head";

import Menu from "src/components/menu";
import { trpc } from "src/utils/trpc";
import Spinner from "src/components/spinner";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { ssrInit } from "src/utils/ssg";

const ViewClients = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const utils = trpc.useContext();
  const myClients = utils.trainer.getMyClients.getData({
    email,
  });

  const { data: clients } = trpc.trainer.getClients.useQuery();
  console.log(clients);

  return (
    <Menu>
      <Head>
        <title>View Clients</title>
      </Head>
      <h1 className="title-page text-3xl">My Clients</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {myClients &&
          myClients.map((client, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 p-2 shadow-lg drop-shadow-lg bg-stone-300 rounded cursor-pointer hover:bg-gray-600 hover:text-slate-200"
            >
              <h2 className="text-lg">
                <span className="font-bold">Client:</span> {client.name}{" "}
              </h2>
            </div>
          ))}
      </div>

      <h1 className="title-page text-3xl">All Clients</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {clients &&
          clients.map((client, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 p-2 shadow-lg drop-shadow-lg bg-stone-300 rounded cursor-pointer hover:bg-gray-600 hover:text-slate-200"
            >
              <h2 className="text-lg">{client.name} </h2>
            </div>
          ))}
      </div>
    </Menu>
  );
};

export default ViewClients;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  if (email) {
    const user = await ssg.user.getUserByEmail.fetch({ email });

    if (user?.trainerId) {
      await ssg.trainer.getMyClients.prefetch({
        email,
      });
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
