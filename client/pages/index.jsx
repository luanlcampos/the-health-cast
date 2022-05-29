import Head from "next/head";
import Header from "../components/Header";
import { useAuth } from "../firebase/auth";
import UnsignedHome from "../components/UnsignedHome";
import SignedHome from "../components/SignedHome";
import { AiOutlineLoading } from "react-icons/ai";

export default function Home() {
  const { user, userData, adminData, userIsLoading, logout } = useAuth();

  if (user && !userData && !adminData) {
    return (
      <div className="loading-page h-screen w-screen flex items-center justify-center">
        <AiOutlineLoading className="loading-spinner text-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <Header />
      {!user ? <UnsignedHome /> : <SignedHome />}
    </div>
  );
}
