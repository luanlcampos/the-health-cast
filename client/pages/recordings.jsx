import { useEffect, useState } from "react";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";

import { useAuth } from "@/firebase/auth";
import SignedLayout from "@/components/Layout/SignedLayout";
import Link from "next/link";
import Loading from "@/components/Loading";

import { useRouter } from "next/router";

import { db } from "@/firebase/clientApp";
import LiveSessionPreview from "@/components/liveSession/LiveSessionPreview";

export default function Recordings() {
  const { user, userData, adminData } = useAuth();
  const [recordings, setRecordings] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const loadUser = async (uid) => {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          return userSnap.data();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const loadRecordings = async () => {
      try {
        // recording collection reference
        const recordingsReference = collection(db, "liveSessions");
        const listOfRecordingDocs = await getDocs(recordingsReference);
        const data = listOfRecordingDocs.docs.map((givenRecording) => {
          const user = loadUser(givenRecording.data().createdByHcpId);

          return {
            ...givenRecording.data(),
            id: givenRecording.id,
            user: user,
          };
        });

        setRecordings(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    loadRecordings();
  }, []);

  if (user && !userData && !adminData) {
    return <Loading />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SignedLayout>
      <div className="max-h-[calc(100vh-160px)] overflow-y-auto container-snap">
        {!isLoading && recordings && recordings.length > 0 && (
          <div className="px-3">
            <h1 className="text-3xl font-extrabold pb-1">Latest Recordings</h1>
            <div className="main-content-header flex flex-col gap-x-10">
              <h2 className="text-3xl font-semibold pb-5">
                Followed HCP&#39;s
              </h2>
            </div>
            <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 my-10">
              {isLoading && !recordings ? (
                <Loading />
              ) : (
                recordings
                  .filter((givenLiveSession) =>
                    adminData
                      ? adminData.following.includes(
                          givenLiveSession.createdByHcpId
                        ) && givenLiveSession.isARecording
                      : userData.following.includes(
                          givenLiveSession.createdByHcpId
                        ) && givenLiveSession.isARecording
                  )
                  .map((givenLiveSession) => {
                    return (
                      <LiveSessionPreview
                        liveSession={givenLiveSession}
                        key={givenLiveSession.id}
                      ></LiveSessionPreview>
                    );
                  })
              )}
            </div>
            {/* Recommended Lives */}
            <div className="main-content-header flex flex-col gap-x-10">
              <h2 className="text-3xl font-semibold my-5">
                Recommended HCP&#39;s
              </h2>
            </div>
            <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 my-10">
              {isLoading && !LiveSessions ? (
                <Loading />
              ) : (
                recordings
                  .filter((givenLiveSession) =>
                    adminData
                      ? !adminData.following.includes(
                          givenLiveSession.createdByHcpId
                        ) && givenLiveSession.isARecording
                      : !userData.following.includes(
                          givenLiveSession.createdByHcpId
                        ) && givenLiveSession.isARecording
                  )
                  .map((givenLiveSession) => {
                    return (
                      <LiveSessionPreview
                        liveSession={givenLiveSession}
                        key={givenLiveSession.id}
                      ></LiveSessionPreview>
                    );
                  })
              )}
            </div>
          </div>
        )}
      </div>
    </SignedLayout>
  );
}
