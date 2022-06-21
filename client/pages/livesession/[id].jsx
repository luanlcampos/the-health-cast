import Header from "@/components/Layout/Header";
import Loading from "@/components/Loading";
import SideMenu from "@/components/Layout/SideMenu";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LiveSessionStage from "@/components/liveSession/CommonComponents/LiveSessionStage/LiveSessionStage";
import Audience from "@/components/liveSession/CommonComponents/Audience/Audience";
import OngoingLiveSession from "@/components/liveSession/OngoingLiveSession";

//import "@/styles/LiveSession.module.scss";

const livesession = () => {
  // obtaining user info from AuthProvider
  const { user, userData } = useAuth();

  // obtaining Live session ID
  const router = useRouter();
  const givenLiveSessionID = router.query.id;

  const [liveSession, setLiveSession] = useState();
  const [liveSessionCreatedByHcp, setLiveSessionCreatedByHcp] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const loadLiveSession = async () => {
    try {
      // thread collection reference
      const liveSessionRef = doc(db, "liveSessions", givenLiveSessionID);
      const liveSessionSnap = await getDoc(liveSessionRef);

      if (liveSessionSnap.exists()) {
        const data = liveSessionSnap.data();

        return data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadUser = async (userId) => {
    try {
      // user collection reference
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const user = userSnap.data();

        setLiveSessionCreatedByHcp(user.firstName + " " + user.lastName);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // redirect user back to the login page
  if (!user) {
    router.push("/login");
    return;
  }

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
          {!isLoading ? (
            <div className="w-full">
              <div className="container flex">
                <div className="w-3/4">
                  <h1>{givenLiveSessionID}</h1>
                  <LiveSessionStage
                    liveSessionRoomID={givenLiveSessionID}
                  ></LiveSessionStage>
                  <Audience liveSessionRoomID={givenLiveSessionID}></Audience>
                </div>
                <OngoingLiveSession
                  className="w-1/4"
                  liveSessionRoomID={givenLiveSessionID}
                ></OngoingLiveSession>
              </div>
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </div>
  );
};

export default livesession;
