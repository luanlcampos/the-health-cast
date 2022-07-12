import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/clientApp";
import Loading from "@/components/Loading";

import CreateLiveSessionForm from "./CreateLiveSessionForm";
import ViewPastLiveSessions from "./ViewPastLiveSessions";
import ViewScheduledUpcommingSessions from "./ViewScheduledUpcommingSessions";
import Button from "@mui/material/Button";

const ManageLiveSessionsIndex = () => {
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

  const [showForm, setShowForm] = useState(false);

  const triggerShowForm = (e) => {
    e.preventDefault();
    setShowForm(!showForm);
  };

  return (
    <>
      <div className=" max-h-[calc(100vh-300px)] main-content w-full">
        <div className="  main-content-header flex flex-col gap-y-[2rem]">
          <form>
            <Button
              onClick={(e) => triggerShowForm(e)}
              sx={{
                bgcolor: "#a9de09",
                color: "black",
                fontWeight: "bold",
                padding: "1rem",
                "&:hover": {
                  color: "black",
                  backgroundColor: "#a9de09",
                },
              }}
            >
              {showForm ? `Cancel` : `Go Live`}
            </Button>
          </form>
          {showForm && <CreateLiveSessionForm></CreateLiveSessionForm>}
        </div>
        <ViewPastLiveSessions
          LiveSessions={LiveSessions}
        ></ViewPastLiveSessions>
        <ViewScheduledUpcommingSessions
          LiveSessions={LiveSessions}
        ></ViewScheduledUpcommingSessions>
      </div>
    </>
  );
};

export default ManageLiveSessionsIndex;
