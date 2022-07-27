import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import RecordingMetaData from "@/components/liveSession/RecordingMetaData"
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Link from "next/link";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";

import SignedLayout from "@/components/Layout/SignedLayout";

const RecordingById = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;
  const liveSessionRoomId = id;
  const [recordingMetaData, setRecordingMetaData] = useState();
  const [recordingHCPCreatorMetaData, setRecordingHCPCreatorMetaData] =
    useState();
  const [isLoading, setIsLoading] = useState(true);

  const loadRecordingMetaData = async () => {
    // thread collection reference
    const liveSessionReference = doc(db, "liveSessions", liveSessionRoomId);
    const liveSessionDocument = await getDoc(liveSessionReference);

    if (liveSessionDocument.exists()) {
      const data = liveSessionDocument.data();
      return data;
    }
  };

  const loadUser = async (userId) => {
    // user collection reference
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const givenHCPCreator = userSnap.data();
      setRecordingHCPCreatorMetaData(givenHCPCreator);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    loadRecordingMetaData()
      .then((givenRecording) => {
        setRecordingMetaData(givenRecording);
        loadUser(givenRecording.createdByHcpId).catch((err) =>
          console.log(err)
        );
        //loadRecording(givenRecording.recordingURL);
        console.log("Sucessfully loaded the recording", givenRecording);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(false);
  }, []);

  if (!user) {
    router.push("/login");
    return;
  }

  return (
    <div>
      <SignedLayout>
        {!isLoading &&
        recordingMetaData &&
        recordingHCPCreatorMetaData &&
        recordingMetaData.isARecording &&
        recordingMetaData.recordingURL ? (
          <div className="w-full container flex">
            <div className="w-2/3 m-3 flex-1">
              <ReactPlayer
                url={recordingMetaData.recordingURL}
                controls={true}
                playing={true}
                width="100%"
                height="100%"
              />
            </div>
            <div className="w-1/3">
              <RecordingMetaData
                liveSessionMetaData={recordingMetaData}
                hcpCreatorInfo={recordingHCPCreatorMetaData}
              ></RecordingMetaData>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-rows-3 grid-flow-col gap-4">
              <h1>This recording does not exist.</h1>
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
          </>
        )}
      </SignedLayout>
    </div>
  );
};

export default RecordingById;

// Prevent loss of threadID after hard-refresh
export async function getServerSideProps() {
  return {
    props: {},
  };
}
