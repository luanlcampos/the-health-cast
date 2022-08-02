import Header from "./Header";
import SideMenu from "./SideMenu";
import { useAuth } from "@/firebase/auth";

export default function SignedLiveSessionLayout({ children }) {
  const { user } = useAuth();
  return (
    <>
      <Header />
      <div className="flex main-container h-[calc(100vh-70px)]">
        <div className="side-menu w-2/12 min-w-[200px]">
          <SideMenu />
        </div>
        <div className="main-content w-[calc(100%-200px)] px-10 py-5">
          {children}
        </div>
      </div>
    </>
  );
}
