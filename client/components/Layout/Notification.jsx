import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AiFillBell } from "react-icons/ai";
import { MdLiveTv, MdOutlineForum } from "react-icons/md";
import { useAuth } from "@/firebase/auth";
import { useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { useRouter } from "next/router";

export default function Notification() {
  const router = useRouter();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const open = Boolean(anchorEl);

  if (!user) {
    return null;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setNotificationOpen(true);
  };
  const handleClose = async () => {
    setAnchorEl(null);
    setNotificationOpen(false);
    if (notifications.length > 0) {
      setNotificationCount(0);
      // mark as seen
      const userRef = collection(
        db,
        "users",
        String(user.uid),
        "notifications"
      );
      // query
      const q = query(userRef);
      // get all notifications
      const snapshot = await getDocs(q);
      await Promise.all(
        snapshot.docs.map(async (doc) => {
          if (doc.data().seen === false) {
            updateDoc(doc.ref, { seen: true });
          }
        })
      );
    }
  };

  const handleAction = async (e, link) => {
    e.preventDefault();
    await handleClose();
    // setAnchorEl(null);
    // setNotificationCount(0);
    if (link) {
      router.replace("/" + link);
    }
  };

  // dismiss all notifications
  const dismissAllNotifications = async () => {
    try {
      const userRef = collection(
        db,
        "users",
        String(user.uid),
        "notifications"
      );
      const snapshot = await getDocs(userRef);
      await Promise.all(
        snapshot.docs.map(async (doc) => {
          await deleteDoc(doc.ref);
        })
      );
      setNotificationCount(0);
      setNotifications([]);
    } catch (err) {
      console.warn(err);
    }
  };

  // get time from timestamp
  const getTime = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    // return the difference between the current date and the date of the timestamp in seconds
    const diff = Math.floor((Date.now() - date) / 1000);
    // return date.toLocaleString();
    if (diff < 60) {
      if (diff == 1) {
        return "1 second ago";
      }
      return `${diff} seconds ago`;
    }
    if (diff < 3600) {
      if (diff < 120) {
        return "1 minute ago";
      }
      return `${Math.floor(diff / 60)} minutes ago`;
    }
    if (diff < 86400) {
      if (diff < 7200) {
        return "1 hour ago";
      }
      return `${Math.floor(diff / 3600)} hours ago`;
    }
    if (diff < 604800) {
      if (diff < 86400) {
        return "1 day ago";
      }
      return `${Math.floor(diff / 86400)} days ago`;
    }
    if (diff < 31536000) {
      if (diff < 604800) {
        return "1 week ago";
      }
      return `${Math.floor(diff / 604800)} weeks ago`;
    }
    if (diff < 31536000) {
      return "1 year ago";
    }
    return `${Math.floor(diff / 31536000)} years ago`;
  };

  useEffect(() => {
    // query to get the notifications collection for this user
    const q = query(
      collection(db, "users", String(user.uid), "notifications"),
      orderBy("timestamp", "desc")
    );

    // start listening for changes in the collection
    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // get id from the change
          const id = change.doc.id;
          const data = change.doc.data();
          data.id = id;
          // check if it's already seen
          if (data.seen === false) {
            setNotificationCount((prev) => prev + 1);
          }

          // check if notification is not in notifications
          if (!notifications.some((notification) => notification.id === id)) {
            // add it to the notifications array
            setNotifications((prev) => [...prev, data]);
          }
        }
      });
    });

    return () => unsub();
  }, []);

  return (
    <div>
      <div
        onClick={handleClick}
        className={`hover:cursor-pointer w-8 h-8 rounded-full ${
          notificationOpen ? "bg-my-green text-white" : "bg-[#C4C4C4]"
        } shadow-md flex flex-row relative justify-center items-center p-1`}
      >
        <AiFillBell className="w-[20px] h-[20px] " />
        {notificationCount > 0 && (
          <span className="ml-2 absolute top-[-5px] right-[-5px] bg-red-600 text-white w-3 h-3 rounded-full flex justify-center items-center p-2 text-[8px]">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
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
        {/* notification header */}
        <div className="flex flex-row items-center h-10 px-4">
          <span className="text-lg font-bold flex-1">Notifications</span>
          <div className="flex-1 text-right">
            <span
              onClick={dismissAllNotifications}
              className="text-blue-500 hover:cursor-pointer text-sm"
            >
              Dismiss all
            </span>
          </div>
        </div>
        <hr />
        {notifications.length > 0 ? (
          <div className="overflow-y-auto ">
            {notifications.map((n, index) => (
              <MenuItem
                key={index}
                onClick={(e) => handleAction(e, n.link)}
                divider={true}
              >
                <div className="notification-item flex flex-row items-center gap-x-4">
                  <div className="notification-icon w-8 h-8">
                    {n.type === "live" ? (
                      <MdLiveTv className="w-full h-full" />
                    ) : (
                      <MdOutlineForum className="w-full h-full" />
                    )}
                  </div>
                  <div className="notification-body flex flex-col gap-y-0">
                    <div className="notification-item-text font-bold text-sm">
                      {n.message}
                    </div>
                    <div className="notification-item-time text-[#696969] text-sm">
                      {getTime(n.timestamp)}
                    </div>
                  </div>
                </div>
              </MenuItem>
            ))}
          </div>
        ) : (
          <MenuItem autoFocus={false}>
            <div className="notification-item flex flex-row items-center justify-center gap-x-4 w-80 h-20">
              <div className="notification-item-text font-bold text-sm text-[#696969]">
                No notifications
              </div>
            </div>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
