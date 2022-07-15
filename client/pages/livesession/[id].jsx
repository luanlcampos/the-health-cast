import Button from "@mui/material/Button";

import Loading from "@/components/Loading";

import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import LiveSessionStage from "@/components/liveSession/CommonComponents/LiveSessionStage/LiveSessionStage";
import Audience from "@/components/liveSession/CommonComponents/Audience/Audience";
import HCPAndLiveSessionMetaData from "@/components/liveSession/CommonComponents/HCPAndLiveSessionMetaData/HCPAndLiveSessionMetaData";
import LiveSessionChatWindow from "@/components/liveSession/CommonComponents/LiveSessionChatWindow/LiveSessionChatWindow";
import HCPControls from "@/components/liveSession/HCPControls/HCPControls";
import SignedLayout from "@/components/Layout/SignedLayout";

//import "@/styles/LiveSession.module.scss";

const livesession = ({ currentLiveSession }) => {
  // obtaining user info from AuthProvider
  const { user, userData } = useAuth();

  // obtaining Live session ID
  const router = useRouter();
  const givenLiveSessionID = router.query.id;

  const [isLoading, setIsLoading] = useState(false);

  // redirect user back to the login page
  if (!user) {
    router.push("/login");
    return;
  }

  return (
    <SignedLayout>
      {!isLoading ? (
        <div className="w-full my-8">
          <div className="container flex lg:flex-row sm:flex-col md:flex-col h-full">
            <div className="w-3/4">
              <div className="flex justify-center">
                <LiveSessionStage
                  liveSessionRoomID={givenLiveSessionID}
                  hcpCreatorInfo={currentLiveSession.hcpCreatorProfileData}
                ></LiveSessionStage>
              </div>
              <Audience
                className="m-8"
                liveSessionRoomID={givenLiveSessionID}
              ></Audience>
            </div>
            <div className="shrink flex flex-col lg:w-1/4 sm:w-fit md:fit">
              <HCPAndLiveSessionMetaData
                hcpCreatorInfo={currentLiveSession.hcpCreatorProfileData}
                liveSessionRoomID={givenLiveSessionID}
                liveSessionMetaData={currentLiveSession.liveSessionData}
              ></HCPAndLiveSessionMetaData>
              {user.uid == currentLiveSession.hcpCreatorProfileData.uid ? (
                <>
                  <h1>
                    Rendering the HCP controls because the current user is the
                    creator
                  </h1>
                  <HCPControls
                    liveSessionRoomID={givenLiveSessionID}
                    hcpCreatorInfo={currentLiveSession.hcpCreatorProfileData}
                  ></HCPControls>
                </>
              ) : (
                <>
                  <HCPControls
                    className="m-8"
                    liveSessionRoomID={givenLiveSessionID}
                    hcpCreatorInfo={currentLiveSession.hcpCreatorProfileData}
                  ></HCPControls>
                  <Button
                    variant="contained"
                    className="m-8"
                    sx={{
                      bgcolor: "#86a819",
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#a9de09",
                      },
                    }}
                  >
                    Leave as a Participant
                  </Button>
                </>
              )}
              <LiveSessionChatWindow
                liveSessionRoomID={givenLiveSessionID}
              ></LiveSessionChatWindow>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </SignedLayout>
  );
};

export const getServerSideProps = async (context) => {
  const givenLiveSessionId = context.params.id; // Get ID from slug `/livesession/[id]`
  let hcpCreatorProfileData;
  let liveSessionData;
  let currentLiveSession;
  let isAdmin = false;

  try {
    const liveSessionResult = await getDoc(
      doc(db, "liveSessions", String(givenLiveSessionId))
    );
    if (liveSessionResult && liveSessionResult.exists()) {
      liveSessionData = liveSessionResult.data();
      try {
        const userResult = await getDoc(
          doc(db, "users", String(liveSessionData.createdByHcpId))
        );
        if (userResult && userResult.exists()) {
          hcpCreatorProfileData = userResult.data();
          isAdmin = false;

          if (!isAdmin && hcpCreatorProfileData) {
            // set the hcp UID
            hcpCreatorProfileData.uid = liveSessionData.createdByHcpId;
            // -- Stringify the time stamps for the user
            hcpCreatorProfileData.createdAt = JSON.stringify(
              hcpCreatorProfileData.createdAt
            );
            hcpCreatorProfileData.updatedAt = JSON.stringify(
              hcpCreatorProfileData.updatedAt
            );
            // -- Stringify the time stamps for the livesession as well
            liveSessionData.sessionScheduleDate = JSON.stringify(
              liveSessionData.sessionScheduleDate
            );
            liveSessionData.createdAt = JSON.stringify(
              liveSessionData.createdAt
            );
            liveSessionData.updatedAt = JSON.stringify(
              liveSessionData.updatedAt
            );
          }
          if (
            hcpCreatorProfileData &&
            hcpCreatorProfileData.firstMonthlyReportDate
          ) {
            hcpCreatorProfileData.firstMonthlyReportDate = JSON.stringify(
              hcpCreatorProfileData.firstMonthlyReportDate
            );
          }
          currentLiveSession = { liveSessionData, hcpCreatorProfileData };
        }
      } catch (e) {
        console.error("error: ", e);
      }
    }
  } catch (e) {
    console.error(e);
  }
  return {
    props: { currentLiveSession },
  };
};

export default livesession;

// {liveSessionData: {…}, userProfileData: {…}}liveSessionData: {endTime: '', sessionScheduleDate: '{"seconds":1655784000,"nanoseconds":0}', interests: Array(3), createdByHcpId: '11LQOyRvh5hP4EUQJZmPaDv0Nhx2', description: 'description here ..', …}userProfileData: {firstName: 'Jeff', permission: 'stream', hcpProfession: 'Chiropodists', requestedHcp: true, updatedAt: '{"seconds":1655146822,"nanoseconds":173000000}', …}[[Prototype]]: Object
