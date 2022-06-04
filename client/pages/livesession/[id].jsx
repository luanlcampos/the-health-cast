import Header from "@/components/Layout/Header";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import OngoingLiveSession from "@/components/liveSession/OngoingLiveSession";

//import "@/styles/LiveSession.module.scss";

const livesession = () => {
  // obtaining user info from AuthProvider
  const { user, userData } = useAuth();

  // obtaining Live session ID
  const router = useRouter();
  const givenLiveSessionID = router.query.id;

  

  // redirect user back to the login page
  if (!user) {
    router.push("/login");
    return;
  }

  return (
    <>
      <Header user={user} />
      <div className="main">
        <div className="container org-opt">
          <h1>{givenLiveSessionID}</h1>
          <OngoingLiveSession></OngoingLiveSession>
        </div>
      </div>
    </>
  );
};

export default livesession;
