import Link from "next/link";
import { useState } from "react";
import {
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineLogout,
} from "react-icons/ai";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useAuth } from "../../firebase/auth";
import { Menu } from "@headlessui/react";
import Notification from "./Notification";
import SearchModal from "./SearchModal";
import UserMenu from "./UserMenu";

function Header() {
  const { userData, adminData, user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header>
      {searchOpen === true && <SearchModal setSearchOpen={setSearchOpen} />}
      <nav
        aria-label="menu nav"
        className="bg-white-800 pt-2 md:pt-1 pb-1 px-1 mt-0 min-h-[60px] h-auto w-full z-20 top-0 drop-shadow-sm"
      >
        <div className="flex flex-wrap items-center min-h-[calc(60px-8px)]">
          <div className="flex flex-shrink md:w-1/3 justify-center md:justify-start">
            <a href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="logo"
                className="h-[60px!important] w-auto"
              />
            </a>
          </div>
          {/* <div className="flex flex-1 md:w-1/3 justify-end md:justify-start px-2"></div> */}

          <div className="flex flex-shrink md:w-2/3 justify-end md:flex-none">
            <div className="flex ">
              <div className="flex items-center pr-4 gap-x-4">
                {user && (
                  <span
                    className="relative w-full"
                    onClick={() => setSearchOpen(true)}
                  >
                    <button className="flex items-center gap-x-2 px-2 py-1 rounded-full text-gray-500 focus:outline-none focus:shadow-outline">
                      <AiOutlineSearch className="h-6 w-6" />
                      <span className="ml-1">Search</span>
                    </button>
                  </span>
                )}
                <Notification />
                {(user && userData) || adminData ? (
                  <UserMenu
                    user={user}
                    userData={userData}
                    adminData={adminData}
                  />
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
