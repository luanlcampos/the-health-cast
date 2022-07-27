import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";

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
import { Timestamp } from "firebase/firestore";

import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import Loading from "@/components/Loading";

import SignedLayout from "@/components/Layout/SignedLayout";

const RecordingById = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;
  const liveSessionRoomId = id;
  const recording = useRef();
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
        recordingMetaData.isARecording &&
        recordingMetaData.recordingURL ? (
          <div className="w-full container flex">
           <div>

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
