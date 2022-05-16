import Head from "next/head";
import Header from "../components/Header";
import { useAuth } from "../firebase/auth";
import UnsignedHome from "../components/UnsignedHome";
import SignedHome from "../components/SignedHome";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen ">
      <Header user={user} />
      {!user ? <UnsignedHome /> : <SignedHome />}
    </div>
  );
}
