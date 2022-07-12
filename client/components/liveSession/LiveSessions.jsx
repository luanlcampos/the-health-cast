import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import LiveSessionPreview from "./LiveSessionPreview";
import Loading from "@/components/Loading";

const LiveSessions = ({ userData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [LiveSessions, setLiveSessions] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const loadLiveSessions = async () => {
      try {
        // thread collection reference
        const liveSessionsRef = collection(db, "liveSessions");
        const liveSessionsSnap = await getDocs(liveSessionsRef);
        const data = liveSessionsSnap.docs.map((givenLiveSession) => ({
          ...givenLiveSession.data(),
          id: givenLiveSession.id,
        }));

        setLiveSessions(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    loadLiveSessions();
  }, []);

  return (
    <div className="max-h-[calc(100vh-160px)] overflow-auto">
      {!isLoading && LiveSessions.length > 0 && (
        <div>
          <div className="card-list flex flex-row flex-wrap justify-between w-full">
            {isLoading && !LiveSessions ? (
              <Loading />
            ) : (
              LiveSessions.filter((givenLiveSession) =>
                userData.following.includes(givenLiveSession.createdByHcpId)
              ).map((givenLiveSession) => {
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
            <h1 className="text-3xl font-bold my-5">Recommended HCP&#39;s</h1>
          </div>
          <div className="card-list flex flex-row flex-wrap justify-between w-full ">
            {isLoading && !LiveSessions ? (
              <Loading />
            ) : (
              LiveSessions.filter(
                (givenLiveSession) =>
                  !userData.following.includes(givenLiveSession.createdByHcpId)
              ).map((givenLiveSession) => {
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
  );
};

export default LiveSessions;
