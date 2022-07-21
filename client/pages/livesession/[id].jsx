import Button from "@mui/material/Button";

import Loading from "@/components/Loading";

import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

import dynamic from "next/dynamic";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import LiveSessionStage from "@/components/liveSession/CommonComponents/LiveSessionStage/LiveSessionStage";

import HCPAndLiveSessionMetaData from "@/components/liveSession/CommonComponents/HCPAndLiveSessionMetaData/HCPAndLiveSessionMetaData";
import LiveSessionChatWindow from "@/components/liveSession/CommonComponents/LiveSessionChatWindow/LiveSessionChatWindow";

import SignedLayout from "@/components/Layout/SignedLayout";
import { modifyLiveSessionLife } from "@/components/liveSession/HCPControls/modifyLiveSession";
const HCPControls = dynamic(
  () => import("@/components/liveSession/HCPControls/HCPControls"),
  { ssr: false }
);

const livesession = ({ currentLiveSession }) => {
  // obtaining user info from AuthProvider
  const { user, userData } = useAuth();

  // obtaining Live session ID
  const router = useRouter();
  const givenLiveSessionID = router.query.id;

  const [isLoading, setIsLoading] = useState(true);
  const [creatorStatus, setCreatorStatus] = useState(false);

  const [liveSessionDocReference, setLiveSessionDocReference] = useState();
  const [liveSessionDocument, setLiveSessionDocument] = useState();

  // redirect user back to the login page
  if (!user) {
    router.push("/login");
    return;
  }

  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      // Analyze if health care professional is leaving the room admist them recording or leaving the session open.
      if (
        creatorStatus &&
        currentLiveSession.liveSessionMetaData &&
        currentLiveSession.liveSessionMetaData.isOngoing
      ) {
        // Have SSR render bad routes as a 404.
        if (liveSessionDocument.isOngoing)
          modifyLiveSessionLife(liveSessionDocReference);
      }

      return true;
    });

    if (user && userData) {
      setIsLoading(false);
    }
    if (
      user &&
      userData &&
      user.uid == currentLiveSession.hcpCreatorProfileData.uid
    )
      setCreatorStatus(true);

    const getLiveSessionReferenceAndDocument = async () => {
      try {
        console.log(givenLiveSessionID);
        let lsref = await doc(db, "liveSessions", givenLiveSessionID);

        setLiveSessionDocReference(lsref);
        let lsdoc = await getDoc(lsref);

        const data = { ...lsdoc.data() };
        console.log("-----------");
        console.log(data);
        console.log("-----------");
        setLiveSessionDocument(data);
      } catch (e) {
        console.error("Could not fetch the document");
      }
    };
    getLiveSessionReferenceAndDocument();
  }, []);

  const handleLeaveRoom = async () => {
    router.push(`/`);
  };

  return (
    <SignedLayout>
      {!user && !userData ? (
        <Loading />
      ) : (
        <div className="w-full my-8">
          <div className="container flex lg:flex-row sm:flex-col md:flex-col h-full">
            <div className="w-3/4">
              <div className="flex justify-center h-[76vh]">
                <LiveSessionStage
                  liveSessionRoomID={givenLiveSessionID}
                  currentUserData={userData}
                  creatorStatus={creatorStatus}
                ></LiveSessionStage>
              </div>
            </div>
            <div className="shrink flex flex-col lg:w-1/4 sm:w-fit md:fit">
              <HCPAndLiveSessionMetaData
                hcpCreatorInfo={currentLiveSession.hcpCreatorProfileData}
                liveSessionRoomID={givenLiveSessionID}
                liveSessionMetaData={currentLiveSession.liveSessionData}
              ></HCPAndLiveSessionMetaData>
              {creatorStatus ? (
                <>
                  <h1>
                    Rendering the HCP controls because the current user is the
                    creator
                  </h1>
                  <HCPControls
                    liveSessionMetaData={currentLiveSession.liveSessionData}
                    liveSessionRoomID={givenLiveSessionID}
                    liveSessionDocReference={liveSessionDocReference}
                    liveSessionDocument={liveSessionDocument}
                  ></HCPControls>
                </>
              ) : (
                <>
                  <Button
                    ob
                    onClick={handleLeaveRoom}
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
                    Leave Room
                  </Button>
                </>
              )}
              <LiveSessionChatWindow
                liveSessionRoomID={givenLiveSessionID}
              ></LiveSessionChatWindow>
            </div>
          </div>
        </div>
      )}
    </SignedLayout>
  );
};

export const getServerSideProps = async (context) => {
  const { id } = context.query; // Get ID from slug `/livesession/[id]`
  const givenLiveSessionId = id;
  let hcpCreatorProfileData;
  let liveSessionData;
  let currentLiveSession;
  let isAdmin = false;

  if (!givenLiveSessionId) throw Error("Live session Id is not given");
  try {
    const liveSessionDocReference = doc(
      db,
      "liveSessions",
      String(givenLiveSessionId)
    );
    const liveSessionResult = await getDoc(liveSessionDocReference);
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
        } else {
          throw Error("Health care professional does not exist");
        }
      } catch (e) {
        console.error("error: ", e);
      }
    } else {
      throw Error("Live session does not exist!");
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
