import { useRouter } from "next/router";
import { useAuth } from "@/firebase/auth";
import SideMenu from "@/components/Layout/SideMenu";
import Header from "@/components/Layout/Header";

const Thread = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { currentThread } = router.query;
  // const [isLoading, setIsLoading] = useState(true);
  const thread = JSON.parse(currentThread);

  return (
    <div>
      <div>
        <Header user={user} />
        <div className="flex main-container h-[calc(100vh-70px)]">
          <div className="side-menu w-2/12 min-w-[200px]">
            <SideMenu />
          </div>
          <div className="w-full px-10 py-5">
            <h2 className="text-2xl font">{thread.title}</h2>
            <div className="border-b border-black mb-5"></div>
            <div className="flex">
              <div>
                <img
                  src="https://via.placeholder.com/125"
                  width="150px"
                  height="150px"
                  className="p-4"
                  alt="profile"
                />
              </div>
              <div>
                <div>{thread.authorId}</div>
                <div>{thread.content}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thread;
