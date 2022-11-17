import { Dialog, Transition, RadioGroup } from "@headlessui/react";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { Fragment, useEffect, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { useRouter } from "next/router";
import Head from "next/head";

import { trpc } from "src/utils/trpc";
import { ssrInit } from "src/utils/ssg";

const users = [
  {
    type: "Trainer",
    description: "I am a trainer and I want to check my client progress.",
  },
  {
    type: "Client",
    description: "I am a client and I want to check my progress and workouts.",
  },
];

const TypeUser = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [selected, setSelected] = useState(users[0]);

  const utils = trpc.useContext();

  const { data: userData } = trpc.user.getUserByEmail.useQuery({
    email,
  });

  const createClient = trpc.client.createClient.useMutation({
    async onSuccess() {
      await utils.user.getUserByEmail.invalidate();
    },
  });

  const createTrainer = trpc.trainer.createTrainer.useMutation({
    async onSuccess() {
      await utils.user.getUserByEmail.invalidate();
    },
  });

  const handleUpdateTypeUser = async (type: string) => {
    try {
      if (userData) {
        const { name, email, image, id } = userData;

        const data = {
          name,
          email,
          image,
          userId: id,
        };
        if (type === "Client") {
          const newClient = await createClient.mutateAsync(data);
          if (newClient) {
            setIsOpen(false);
            router.push("/");
          }
        } else {
          const newTrainer = await createTrainer.mutateAsync(data);
          if (newTrainer) {
            setIsOpen(false);
            router.push("/");
          }
        }
      }
    } catch {}
  };

  const closeModal = () => {
    router.push("/");
  };

  /* useEffect(() => { */
  /*   if (!email) { */
  /*     router.push("/"); */
  /*   } */
  /**/
  /*   if (userData?.clientId || userData?.trainerId) { */
  /*     router.push("/"); */
  /*   } */
  /* }, [email, router, userData]); */

  return (
    <>
      <Head>
        <title>Type of User</title>
      </Head>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-slate-800 rounded-2xl p-6 text-left align-middle shadow-xl transition-all h-full">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-slate-200 text-center"
                  >
                    Select Type of User
                  </Dialog.Title>

                  <div className="w-full px-4 py-16">
                    <div className="mx-auto w-full max-w-md">
                      <RadioGroup value={selected} onChange={setSelected}>
                        <div className="space-y-2">
                          {users.map((user, i) => (
                            <RadioGroup.Option
                              key={i}
                              value={user}
                              className={({ active, checked }) =>
                                `${
                                  active
                                    ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                                    : ""
                                }
                  ${
                    checked ? "bg-sky-300 bg-opacity-75 text-white" : "bg-white"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center">
                                      <div className="text-sm">
                                        <RadioGroup.Label
                                          as="p"
                                          className={`font-medium text-xl ${
                                            checked
                                              ? "text-slate-900"
                                              : "text-slate-900"
                                          }`}
                                        >
                                          {user.type}
                                        </RadioGroup.Label>
                                        <RadioGroup.Description
                                          as="span"
                                          className={`inline text-lg ${
                                            checked
                                              ? "text-slate-900"
                                              : "text-gray-500"
                                          }`}
                                        >
                                          <span>{user.description}</span>
                                        </RadioGroup.Description>
                                      </div>
                                    </div>
                                    {checked && (
                                      <div className="shrink-0 text-white">
                                        <BsCheckLg className="h-6 w-6" />
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-slate-900 hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 text-lg"
                      onClick={() =>
                        handleUpdateTypeUser(selected?.type as string)
                      }
                    >
                      Select Option
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TypeUser;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  if (email) {
    await ssg.user.getUserByEmail.prefetch({
      email,
    });

    return {
      props: {
        trpcState: ssg.dehydrate(),
        email: email ?? null,
      },
    };
  } else {
    console.log("HI")
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
