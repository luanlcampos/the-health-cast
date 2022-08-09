import Button from "@mui/material/Button";
import nookies from "nookies";
import Link from "next/link";

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

import SignedLiveSessionLayout from "@/components/Layout/SignedLiveSessionLayout";
import { modifyLiveSessionLife } from "@/model/LiveSessions/modifyLiveSession";
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
    setCreatorStatus(
      currentLiveSession.liveSessionData.createdByHcpId == user.uid
    );

    if (user && userData) {
      setIsLoading(false);
    }

    const getLiveSessionReferenceAndDocument = async () => {
      try {
        console.log(givenLiveSessionID);
        let lsref = await doc(db, "liveSessions", givenLiveSessionID);

        setLiveSessionDocReference(lsref);
        let lsdoc = await getDoc(lsref);

        const data = { ...lsdoc.data() };
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
    <SignedLiveSessionLayout>
      {!user && !userData && !currentLiveSession ? (
        <Loading />
      ) : currentLiveSession.liveSessionData.isOngoing ? (
        <div className="w-full my-8">
          <div className="flex lg:flex-row sm:flex-col md:flex-col h-full">
            <div className="w-8/12 m-3">
              <div className="flex flex-col justify-center gap-x-2">
                <LiveSessionStage
                  liveSessionRoomID={givenLiveSessionID}
                  currentUserData={userData}
                  creatorStatus={creatorStatus}
                ></LiveSessionStage>
                {creatorStatus && (
                  <>
                    <HCPControls
                      liveSessionMetaData={currentLiveSession.liveSessionData}
                      liveSessionRoomID={givenLiveSessionID}
                      liveSessionDocReference={liveSessionDocReference}
                      liveSessionDocument={liveSessionDocument}
                      createdByHcpId={
                        currentLiveSession.liveSessionData.createdByHcpId
                      }
                    ></HCPControls>
                  </>
                )}
              </div>
            </div>
            <div className="shrink m-3 flex flex-col lg:w-1/4 sm:w-fit md:fit">
              <HCPAndLiveSessionMetaData
                hcpCreatorInfo={currentLiveSession.hcpCreatorProfileData}
                liveSessionRoomID={givenLiveSessionID}
                liveSessionMetaData={currentLiveSession.liveSessionData}
              ></HCPAndLiveSessionMetaData>
              {!creatorStatus && (
                <>
                  <Button
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
      ) : (
        <div className="main-content w-full px-10 py-5">
          <div className="main-content-header flex flex-col gap-x-10">
            <h1 className="text-3xl font-bold pb-5">Sorry</h1>
          </div>
          <div className="grid grid-rows-3 grid-flow-col gap-4">
            <h1>The room is now closed. Be sure to check out the Recordings page or use the search bar to find similar lives</h1>
            <div>
              <Link href="/" passHref={true}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#86a819",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "#a9de09",
                    },
                  }}
                >
                  Return to home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </SignedLiveSessionLayout>
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
    const cookies = nookies.get(context);
    const token = cookies.token;

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
