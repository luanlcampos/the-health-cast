import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import SideMenu from "@/components/Layout/SideMenu";
import Header from "@/components/Layout/Header";
import Thread from "@/components/Forum/Thread";
import Reply from "@/components/Reply/Reply";

const ThreadById = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { threadID, currentThread, author } = router.query;
  const [thread, setThread] = useState();
  const [thrAuthor, setThrAuthor] = useState();
  const [isLoading, setIsLoading] = useState(true);

  if (currentThread) {
    useEffect(() => {
      setThread(JSON.parse(currentThread));
      setThrAuthor(JSON.parse(author));
      setIsLoading(false);
    }, []);
  } else {
    useEffect(() => {
      setIsLoading(true);

      const loadThread = async () => {
        try {
          // thread collection reference
          const threadRef = doc(db, "threads", threadID);
          const threadSnap = await getDoc(threadRef);

          if (threadSnap.exists()) {
            const data = threadSnap.data();

            setThread(data);
          }
        } catch (err) {
          console.log(err);
        }
      };

      const loadUser = async (userId) => {
        try {
          // user collection reference
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const user = userSnap.data();

            setUser(user);
          }
        } catch (err) {
          console.log(err);
        }
      };

      loadThread()
        .then((thread) => {
          loadUser(thread.authorId).catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));

      setIsLoading(false);
    }, []);
  }

  if (!user) {
    router.push("/login");
    return;
  }

  return (
    <div>
      <div>
        {/* Header */}
        <Header user={user} />
        <div className="flex main-container h-[calc(100vh-70px)]">
          {/* SideMenu */}
          <div className="side-menu w-2/12 min-w-[200px]">
            <SideMenu />
          </div>
          {!isLoading && thread ? (
            <div className="w-full">
              <Thread thread={thread} user={thrAuthor} />
              <div className="flex bg-gray-200 p-5 shadow-xl m-10 rounded-xl">
                <img
                  src="https://via.placeholder.com/30"
                  width="30px"
                  height="30px"
                  className="rounded-full mr-5"
                  alt="profile"
                />
                <input
                  type="text"
                  placeholder="New Comment..."
                  className="grow py-1 px-3 rounded-md"
                />
                <button
                  type="submit"
                  className="bg-my-green text-white ml-5 px-10 py-1 rounded-lg"
                >
                  Reply
                </button>
              </div>
              {/* Comment */}
              <Reply />
            </div>
          ) : (
            <div className="w-full h-full">
              <div className="w-full bg-gray-100 h-full p-24">
                <h1 className="text-5xl font-bold mb-10">
                  Sorry... <br /> We cannot find what you are looking for...
                </h1>
                <p className="text-2xl">
                  Go back to{" "}
                  <Link href="/">
                    <a className="text-my-green hover:underline hover:underline-offset-2">
                      Home
                    </a>
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadById;
