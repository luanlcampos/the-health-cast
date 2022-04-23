import Link from "next/link";
import Image from "next/image";
import {
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineLogout,
} from "react-icons/ai";
import { useAuth } from "../firebase/auth";
import { Menu, Transition } from "@headlessui/react";

function Header({ user }) {
  const { login, logout, userData } = useAuth();
  const handleLogOut = () => {
    logout();
  };
  return (
    <header>
      <nav
        aria-label="menu nav"
        className="bg-white-800 pt-2 md:pt-1 pb-1 px-1 mt-0 min-h-[60px] h-auto w-full z-20 top-0 drop-shadow-sm"
      >
        <div className="flex flex-wrap items-center min-h-[calc(60px-8px)]">
          <div className="flex flex-shrink md:w-1/3 justify-center md:justify-start">
            <a href="#" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="logo"
                className="h-[60px!important] w-auto"
              />
            </a>
          </div>
          <div className="flex flex-1 md:w-1/3 justify-end md:justify-start px-2">
            {user && userData && (
              <span className="relative w-full">
                <input
                  type="search"
                  className="w-full bg-gray-200 rounded-full px-3 py-1 focus:outline-none focus:shadow-outline appearance-none leading-normal"
                  placeholder="Search"
                />
              </span>
            )}
          </div>

          <div className="flex flex-shrink md:w-1/3 justify-end md:flex-none">
            <div className="flex items-end">
              <div className="flex items-center pr-4">
                {user && userData ? (
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="px-2 py-2">
                      <span className="flex flex-row items-center gap-2">
                        <AiOutlineUser /> Hello, {userData.firstName}{" "}
                      </span>
                    </Menu.Button>
                    <Menu.Items className="flex flex-col absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={`px-2 py-2 flex flex-row items-center gap-2 ${
                              active && "bg-my-green text-white text-bold"
                            }`}
                            href="/profile"
                          >
                            <AiOutlineUser />
                            Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={`px-2 py-2 flex flex-row items-center gap-2 hover:cursor-pointer ${
                              active && "bg-my-green text-white text-bold"
                            }`}
                            onClick={handleLogOut}
                          >
                            <AiOutlineLogout />
                            Logout
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                ) : (
                  <>
                    <button className="login-button p-2 rounded-md border border-my-blue text-my-blue mr-2 font-bold">
                      <Link href="/login">Log In</Link>
                    </button>
                    <button className="signup-button p-2 rounded-md border border-my-green text-white bg-my-green font-bold">
                      <Link href="/signup">Sign Up</Link>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
