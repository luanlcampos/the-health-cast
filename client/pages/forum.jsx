import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import ThreadPreview from "@/components/forum/ThreadPreview";
import Header from "@/components/Layout/Header";
import SideMenu from "@/components/Layout/SideMenu";
import Loading from "@/components/Loading";
import SignedLayout from "@/components/Layout/SignedLayout";
import ChatContainer from "../components/Chat/ChatContainer";

const Forum = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [threads, setThreads] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const loadUser = async (uid) => {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          return userSnap.data();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const loadThreads = async () => {
      try {
        // thread collection reference
        const threadRef = collection(db, "threads");
        const threadSnap = await getDocs(threadRef);
        const data = threadSnap.docs.map((thread) => {
          const user = loadUser(thread.data().authorId);

          return {
            ...thread.data(),
            id: thread.id,
            user: user,
          };
        });

        setThreads(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    loadThreads();
  }, []);

  if (!user) {
    router.push("/login");
    return;
  }

  return (
    <div>
      <SignedLayout>
        <div className="w-full px-10 py-5">
          <h1 className="text-3xl font-bold pb-10">Latest Posts</h1>
          <h2 className="text-2xl font">Followed HCP's</h2>
          <div className="border-b border-black mb-5"></div>

          <div className="pb-10">
            {isLoading && !threads ? (
              <Loading />
            ) : (
              threads.map((thread) => {
                return <ThreadPreview thread={thread} key={thread.id} />;
              })
            )}
          </div>

          <div className="flex pb-10">
            <div className="border-b border-gray-400 grow"></div>
            <div className="text-my-green hover:cursor-pointer relative">
              <div className="absolute w-max -top-3 bg-white px-5">
                Load more
              </div>
            </div>
            <div className="border-b border-gray-400 grow"></div>
          </div>
          <h2 className="text-2xl font">Recommended HCP's</h2>
          <div className="border-b border-black mb-5"></div>

          {/* TODO: Recommended threads will be popluated here */}
          <div></div>
        </div>
      </SignedLayout>
      <ChatContainer />
    </div>
  );
};

export default Forum;
