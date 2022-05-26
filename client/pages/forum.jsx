import Thread from "../components/forum/Thread";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";

const Forum = () => {
  return (
    <div>
      <Header />
      <div className="flex min-h-screen">
        <div className="side-menu w-2/12 min-w-[200px]">
          <SideMenu />
        </div>
        <div className="w-full px-10 py-5">
          <h1 className="text-3xl font-bold pb-10">Latest Posts</h1>
          <h2 className="text-2xl font">Followed HCP's</h2>
          <div className="border-b border-black mb-5"></div>

          <div className="pb-10">
            <Thread />
            <Thread />
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

          <div>
            <Thread />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
