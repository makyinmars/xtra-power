import type { NextPage } from "next";
import { FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { trpc } from "src/utils/trpc";

const Home: NextPage = () => {
  const { data: session } = useSession();

  const { data: user } = trpc.user.getUserByEmail.useQuery({
    email: session ? (session.user?.email as string) : "nice try",
  });

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
            <div className="self-center w-40 h-40">
              <Image
                src={session.user?.image as string}
                alt={session.user?.name as string}
                className="rounded-full mx-auto "
                width={200}
                height={200}
                priority={true}
              />
            </div>
            <div className="flex justify-center">
              <button className="button w-full" onClick={() => signOut()}>
                Sign Out
              </button>
            </div>
            <div className="flex flex-col items-center justify-around gap-4">
              <Link href="/user">
                <button className="button w-full">
                  {user?.clientId ? "User" : "Trainer"}
                </button>
              </Link>
              {user && user.clientId && (
                <Link href="/workout">
                  <button className="button w-full">Workout</button>
                </Link>
              )}
              {user && user.clientId ? (
                <Link href="/view-trainers">
                  <button className="button w-full">Select Trainer</button>
                </Link>
              ) : (
                <Link href="/view-clients">
                  <button className="button w-full">View Clients</button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <h2 className="col-span-2 text-center subtitle-page">
              Sign in with
            </h2>
            <button
              className="button w-full"
              onClick={() =>
                signIn("discord", {
                  callbackUrl: `/type-user`,
                })
              }
            >
              <FaDiscord className="icon-menu text-purple-400" />
            </button>
            <button
              className="button w-full"
              onClick={() =>
                signIn("google", {
                  callbackUrl: `/type-user`,
                })
              }
            >
              <FcGoogle className="icon-menu" />
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
