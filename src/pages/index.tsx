import type { NextPage, GetServerSideProps } from "next";
import Image from "next/image";
import Head from "next/head";
import {
  signIn,
  signOut,
  useSession,
  getProviders,
  getSession,
} from "next-auth/react";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Xtra Power</title>
        <meta
          name="description"
          content="Get your workouts my friend with Xtra Power!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto gap-4">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-500 to-slate-900">
          Xtra Power
        </h1>
        {session ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl text-slate-900 text-center">
              Signed in as {session.user?.name}
            </h2>
            <Image
              src={session.user?.image as string}
              alt={session.user?.name as string}
              className="w-10 h-10 rounded-full"
              width={50}
              height={200}
              priority={true}
            />
            <div className="flex justify-center">
              <button className="button w-full" onClick={() => signOut()}>
                Sign out
              </button>
            </div>
            <div className="flex justify-around gap-4">
              <Link href="/user">
                <button className="button">User</button>
              </Link>
              <Link href="/workout">
                <button className="button">Workout</button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <button
              className="button w-full"
              onClick={() =>
                signIn("discord", {
                  callbackUrl: `/type-user`,
                })
              }
            >
              Sign in
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;

/* export const getServerSideProps: GetServerSideProps = async (context) => { */
/*   const session = await getSession(context); */
/**/
/*   if (!session) { */
/*     return { */
/*       redirect: { */
/*         destination: "/", */
/*         permanent: false, */
/*       }, */
/*     }; */
/*   } */
/**/
/*   const providers = await getProviders(); */
/*   return { */
/*     props: { */
/*       providers, */
/*     }, */
/*   }; */
/* }; */
