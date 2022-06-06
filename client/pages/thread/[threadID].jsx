import { useRouter } from "next/router";
import { useAuth } from "@/firebase/auth";
import SideMenu from "@/components/Layout/SideMenu";
import Header from "@/components/Layout/Header";
import Thread from "@/components/Forum/Thread";
import Reply from "@/components/Reply/Reply";

const ThreadById = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { currentThread } = router.query;

  const thread = JSON.parse(currentThread);

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

          <div className="w-full">
            <Thread thread={thread} />
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
        </div>
      </div>
    </div>
  );
};

export default ThreadById;
