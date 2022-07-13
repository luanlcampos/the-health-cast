import { useAuth } from "../../firebase/auth";
import SideMenu from "../Layout/SideMenu";
import LiveSessions from "@/components//liveSession/LiveSessions";
import ChatContainer from "../Chat/ChatContainer";
import Footer from "../Layout/Footer";

export default function SignedHome() {
  const { user, userData } = useAuth();
  return (
    <>
      <div className="main-container flex flex-column h-[calc(100vh-70px)]">
        <div className="side-menu w-2/12 min-w-[200px]">
          <SideMenu />
        </div>
        {/* Live Now */}
        <div className="main-content w-full px-10 py-5">
          <LiveSessions></LiveSessions>
        </div>
        {/* ChatContainer Btn */}
        <ChatContainer />
      </div>
      <Footer></Footer>
    </>
  );
}
