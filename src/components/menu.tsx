import Link from "next/link";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FcHome } from "react-icons/fc";
import { IoIosFitness } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

interface MenuProps {
  children: React.ReactNode;
}

const Menu = ({ children }: MenuProps) => {
  const { data: session } = useSession();
  const items = [
    {
      label: "Workout",
      href: "/workout",
      icon: <IoIosFitness className="icon-menu" />,
    },
    {
      label: "User",
      href: "/user",
      icon: <FaUserCircle className="icon-menu" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <BiLogOut className="icon-menu" />,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-evenly gap-4">
        <div>
          <Link href="/">
            <a>
              <FcHome className="h-10 w-10" />
            </a>
          </Link>
        </div>
        <HeadlessMenu as="div" className="relative inline-block text-left">
          <div>
            <HeadlessMenu.Button className="flex w-full items-center justify-center gap-2 rounded-md bg-black bg-opacity-60 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              {session?.user?.name}
              {session?.user?.image && (
                <Image
                  src={session?.user?.image as string}
                  alt="avatar"
                  className="mx-auto h-10 w-10 rounded-full"
                  width={30}
                  height={30}
                  priority={true}
                />
              )}
            </HeadlessMenu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <HeadlessMenu.Items className="absolute right-0 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-stone-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="px-1 py-1 ">
                {items.map((item) => (
                  <HeadlessMenu.Item key={item.label}>
                    {({ active }) => (
                      <div
                        className={`${active ? "bg-cyan-700 text-white" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {item.label === "Logout" ? (
                          <button
                            onClick={() =>
                              signOut({
                                callbackUrl: "/",
                              })
                            }
                            className="flex gap-2"
                          >
                            {item.icon} Logout
                          </button>
                        ) : (
                          <Link href={item.href}>
                            <a className="flex gap-2">
                              {item.icon}
                              {item.label}
                            </a>
                          </Link>
                        )}
                      </div>
                    )}
                  </HeadlessMenu.Item>
                ))}
              </div>
            </HeadlessMenu.Items>
          </Transition>
        </HeadlessMenu>
      </div>
      {children}
    </div>
  );
};

export default Menu;
