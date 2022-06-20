import Link from "next/link";
import { useAuth } from "../../firebase/auth";

import {
  AiOutlineHome,
  AiOutlineCalendar,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { RiRecordCircleLine } from "react-icons/ri";
import { MdOutlineForum } from "react-icons/md";

import { useRouter } from "next/router";

export default function SideMenu() {
  const { user, userData, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="side-menu flex bg-[#eee] h-full max-w-[200px]">
      <div className="side-menu-content pl-0 w-full pt-12">
        <ul className="flex flex-col gap-y-10">
          <li
            className={`p-0 w-[150px] py-3 px-8 mx-auto hover:bg-[#d4d4d4] hover:rounded-xl${
              router.pathname == "/"
                ? "active shadow-lg bg-my-green rounded-xl"
                : ""
            }`}
          >
            <div className="flex flex-col text-center">
              <Link href="/">
                <a>
                  <AiOutlineHome className="mx-auto text-3xl mb-2" />
                  <div className="mx-auto text-md">Home</div>
                </a>
              </Link>
            </div>
          </li>
          <li
            className={`p-0 w-[150px] py-3 px-8 mx-auto hover:bg-[#d4d4d4] hover:rounded-xl  ${
              router.pathname == "/recordings"
                ? "active shadow-lg bg-my-green rounded-xl"
                : ""
            }`}
          >
            <div className="flex flex-col text-center">
              <Link href="/recordings">
                <a>
                  <RiRecordCircleLine className="mx-auto text-3xl mb-2" />
                  <div className="mx-auto text-md">Recordings</div>
                </a>
              </Link>
            </div>
          </li>
          <li
            className={`p-0 w-[150px] py-3 px-8 mx-auto hover:bg-[#d4d4d4] hover:rounded-xl  ${
              router.pathname == "/forum"
                ? "active shadow-lg bg-my-green rounded-xl"
                : ""
            }`}
          >
            <div className="flex flex-col text-center">
              <Link href="/forum">
                <a>
                  <MdOutlineForum className="mx-auto text-3xl mb-2" />
                  <div className="mx-auto text-md">Forum</div>
                </a>
              </Link>
            </div>
          </li>
          <li
            className={`p-0 w-[150px] py-3 px-8 mx-auto hover:bg-[#d4d4d4] hover:rounded-xl  ${
              router.pathname == "/upcoming"
                ? "active shadow-lg bg-my-green rounded-xl"
                : ""
            }`}
          >
            <div className="flex flex-col text-center">
              <Link href="/upcoming">
                <a>
                  <AiOutlineCalendar className="mx-auto text-3xl mb-2" />
                  <div className="mx-auto text-md">Upcoming</div>
                </a>
              </Link>
            </div>
          </li>
          {userData && userData.isHcp && (
            <li
              className={`p-0 w-[150px] py-3 px-8 mx-auto hover:bg-[#d4d4d4] hover:rounded-xl  ${
                router.pathname == "/dashboard"
                  ? "active shadow-lg bg-my-green rounded-xl"
                  : ""
              }`}
            >
              <div className="flex flex-col text-center">
                <Link href="/dashboard">
                  <a>
                    <AiOutlinePlusCircle className="mx-auto text-3xl mb-2" />
                    <div className="mx-auto text-md">Dashboard</div>
                  </a>
                </Link>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
