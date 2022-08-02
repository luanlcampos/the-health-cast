import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/clientApp";
import Loading from "@/components/Loading";
import Alert from "@mui/material/Alert";

import CreateLiveSessionForm from "./CreateLiveSessionForm";
import ViewPastLiveSessions from "./ViewPastLiveSessions";
import ViewScheduledUpcommingSessions from "./ViewScheduledUpcommingSessions";
import Button from "@mui/material/Button";

import CreateLiveSessionModal from "./CreateLiveSessionModal";

const ManageLiveSessionsIndex = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");

  const [LiveSessions, setLiveSessions] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    const loadLiveSessions = async () => {
      try {
        // liveSessions collection reference
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

  const [showForm, setShowForm] = useState(false);

  const triggerShowForm = (e) => {
    e.preventDefault();
    setShowForm(!showForm);
  };

  return LiveSessions && LiveSessions.length > 0 ? (
    <>
      <div className=" max-h-[calc(100vh-300px)] main-content w-full">
        <div className="  main-content-header flex flex-col gap-y-[2rem]">
          {alertMessage != "" && (
            <>
              <Alert className="p-8" severity="info">
                {alertMessage}
              </Alert>
              <Loading></Loading>
            </>
          )}
          <CreateLiveSessionModal
            setAlertMessage={setAlertMessage}
          ></CreateLiveSessionModal>
        </div>
        <ViewPastLiveSessions
          LiveSessions={LiveSessions}
        ></ViewPastLiveSessions>
        <ViewScheduledUpcommingSessions
          LiveSessions={LiveSessions}
        ></ViewScheduledUpcommingSessions>
      </div>
    </>
  ) : (
    <>
      <div className="  main-content-header flex flex-col gap-y-[2rem]">
        <Alert className="p-8" severity="info">
          Click the button below to create a new live session
        </Alert>
        <CreateLiveSessionModal
          setAlertMessage={setAlertMessage}
        ></CreateLiveSessionModal>
      </div>
      <Loading></Loading>
    </>
  );
};

export default ManageLiveSessionsIndex;
