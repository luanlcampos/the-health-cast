import Link from "next/link";
import { useState } from "react";
import {
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineLogout,
} from "react-icons/ai";
import { MdOutlineBubbleChart, MdOutlineManageAccounts } from "react-icons/md";
import { useAuth } from "../../firebase/auth";
// import { Menu } from "@headlessui/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";

export default function UserMenu({ user, userData, adminData }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = async () => {
    await logout();
    window.location.href = "/";
  };
  return (
    <div>
      <div
        onClick={handleClick}
        className={`hover:cursor-pointer w-8 h-8 rounded-full shadow-md flex flex-row relative justify-center items-center p-1`}
      >
        <AiOutlineUser className="w-[20px] h-[20px] " />
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 0,
          style: {
            maxHeight: "250px",
          },
          sx: {
            overflow: "auto",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
          },
        }}
      >
        {/* <Link href={`/profile/${user.uid}`}> */}
        <MenuItem onClick={() => router.push(`/profile/${user.uid}`)}>
          <div className="flex items-center gap-x-3">
            <AiOutlineUser />
            <span>Profile</span>
          </div>
        </MenuItem>
        {/* </Link> */}
        {user && adminData && (
          <MenuItem onClick={() => router.push("/admin")}>
            <div className="flex items-center gap-x-3">
              <MdOutlineManageAccounts />
              <span>Admin Console</span>
            </div>
          </MenuItem>
        )}
        {user && userData && userData.isHcp && (
          <MenuItem onClick={() => router.push("/stats")}>
            <div className="flex items-center gap-x-3">
              <MdOutlineBubbleChart />
              <span>Stats</span>
            </div>
          </MenuItem>
        )}        
        <MenuItem onClick={handleLogOut}>
          <div className="flex items-center gap-x-3">
            <AiOutlineLogout />
            <span>Logout</span>
          </div>
        </MenuItem>
      </Menu>
    </div>

    // <Menu as="div" className="relative inline-block text-left">
    //   <Menu.Button className="px-2 py-2">
    //     <span className="flex flex-row items-center gap-2">
    //       <AiOutlineUser className="h-6 w-6" /> Hello,{" "}
    //       {userData ? userData.firstName : adminData.institution}{" "}
    //     </span>
    //   </Menu.Button>
    //   <Menu.Items className="flex flex-col absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
    //     <Menu.Item>
    //       {({ active }) => (
    //         <a
    //           className={`px-2 py-2 flex flex-row items-center gap-2 ${
    //             active && "bg-my-green text-white text-bold"
    //           }`}
    //           href={`/profile/${user.uid}`}
    //         >
    //           <AiOutlineUser />
    //           Profile
    //         </a>
    //       )}
    //     </Menu.Item>
    //     <Menu.Item>
    //       {({ active }) => (
    //         <a
    //           className={`px-2 py-2 flex flex-row items-center gap-2 hover:cursor-pointer ${
    //             active && "bg-my-green text-white text-bold"
    //           }`}
    //           onClick={handleLogOut}
    //         >
    //           <AiOutlineLogout />
    //           Logout
    //         </a>
    //       )}
    //     </Menu.Item>
    //     {adminData !== null && (
    //       <Menu.Item>
    //         {({ active }) => (
    //           <a
    //             className={`px-2 py-2 flex flex-row items-center gap-2 hover:cursor-pointer ${
    //               active && "bg-my-green text-white text-bold"
    //             }`}
    //             href="/admin"
    //           >
    //             <MdOutlineManageAccounts />
    //             Admin Console
    //           </a>
    //         )}
    //       </Menu.Item>
    //     )}
    //   </Menu.Items>
    // </Menu>
  );
}
