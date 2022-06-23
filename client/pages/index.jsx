import Header from "../components/Layout/Header";
import { useAuth } from "../firebase/auth";
import UnsignedHome from "../components/Home/UnsignedHome";
import SignedHome from "../components/Home/SignedHome";
import { AiOutlineLoading } from "react-icons/ai";
import { useRouter } from "next/router";

export default function Home() {
  const { user, userData, adminData, userIsLoading, logout } = useAuth();
  const router = useRouter();

  if (user && !userData && !adminData) {
    return (
      <div className="loading-page h-screen w-screen flex items-center justify-center">
        <AiOutlineLoading className="loading-spinner text-3xl" />
      </div>
    );
  }

  if (user && (userData || adminData) && !user.emailVerified) {
    router.push("/login");
    logout();
  }

  return (
    <div className="min-h-screen">
      <Header />
      {!user ? <UnsignedHome /> : <SignedHome />}
    </div>
  );
}
