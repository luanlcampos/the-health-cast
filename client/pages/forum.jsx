import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import ThreadPreview from "@/components/forum/ThreadPreview";
import Header from "@/components/Layout/Header";
import SideMenu from "@/components/Layout/SideMenu";
import Loading from "@/components/Loading";

const Forum = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [threads, setThreads] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const loadThreads = async () => {
      try {
        // thread collection reference
        const threadRef = collection(db, "threads");
        const threadSnap = await getDocs(threadRef);
        const data = threadSnap.docs.map((thread) => ({
          ...thread.data(),
          id: thread.id,
        }));

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
      <div>
        <Header user={user} />
        <div className="flex main-container h-[calc(100vh-70px)]">
          <div className="side-menu w-2/12 min-w-[200px]">
            <SideMenu />
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default Forum;
