import { useAuth } from "../../firebase/auth";
import SideMenu from "../Layout/SideMenu";
import LiveSessions from "@/components//liveSession/LiveSessions";
import ChatContainer from "../Chat/ChatContainer"

export default function SignedHome() {
  const { user, userData } = useAuth();
  return (
    <div className="main-container flex flex-column h-[calc(100vh-70px)]">
      <div className="side-menu w-2/12 min-w-[200px]">
        <SideMenu />
      </div>
      {/* Live Now */}
      <div className="main-content w-full px-10 py-5">
        <div className="main-content-header flex flex-col gap-x-10">
          <h1 className="text-3xl font-bold pb-5">Live Now</h1>
        </div>
        <LiveSessions></LiveSessions>
      </div>
      {/* ChatContainer Btn */}
      <ChatContainer />
    </div>
  );
}
