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
    <div className="side-menu flex bg-[#eee] h-full">
      <div className="side-menu-content pl-0 w-full pt-5">
        <ul className="flex flex-col gap-y-10">
          <li
            className={`p-0 w-full py-2 hover:bg-[#d4d4d4]${
              router.pathname == "/"
                ? "active bg-[#c4c4c4] border-r-[6px] border-r-my-green"
                : ""
            }`}
          >
            <Link href="/">
              <a className="flex flex-row items-center gap-x-3 text-3xl pl-2">
                <AiOutlineHome />
                Home
              </a>
            </Link>
          </li>
          <li
            className={`p-0 w-full py-2 hover:bg-[#d4d4d4]${
              router.pathname == "/recordings"
                ? "active bg-[#c4c4c4] border-r-[6px] border-r-my-green"
                : ""
            }`}
          >
            <Link href="/recordings">
              <a className="flex flex-row items-center gap-x-3 text-3xl pl-2">
                <RiRecordCircleLine />
                Recorded
              </a>
            </Link>
          </li>
          <li
            className={`p-0 w-full py-2 hover:bg-[#d4d4d4]${
              router.pathname == "/forum"
                ? "active bg-[#c4c4c4] border-r-[6px] border-r-my-green"
                : ""
            }`}
          >
            <Link href="/forum">
              <a className="flex flex-row items-center gap-x-3 text-3xl pl-2">
                <MdOutlineForum />
                Forum
              </a>
            </Link>
          </li>
          <li
            className={`p-0 w-full py-2  hover:bg-[#d4d4d4]  ${
              router.pathname == "/upcoming"
                ? "active bg-[#c4c4c4] border-r-[6px] border-r-my-green"
                : ""
            }`}
          >
            <Link href="/upcoming">
              <a className="flex flex-row items-center gap-x-3 text-3xl pl-2">
                <AiOutlineCalendar />
                Upcoming
              </a>
            </Link>
          </li>
          {userData && userData.isHcp && (
            <li
              className={`p-0 w-full py-2  hover:bg-[#d4d4d4]  ${
                router.pathname == "/upcoming"
                  ? "active bg-[#c4c4c4] border-r-[6px] border-r-my-green"
                  : ""
              }`}
            >
              <Link href="/upcoming">
                <a className="flex flex-row items-center gap-x-3 text-3xl pl-2">
                  <AiOutlinePlusCircle />
                  Create
                </a>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
