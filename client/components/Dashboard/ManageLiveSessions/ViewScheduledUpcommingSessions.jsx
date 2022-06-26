import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/clientApp";

const ViewScheduledUpcommingSessions = () => {
  const [liveSessions, setliveSessions] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const loadThreads = async () => {
      try {
        // thread collection reference
        const threadRef = collection(db, "liveSessions");
        const threadSnap = await getDocs(threadRef);
        const data = threadSnap.docs.map((thread) => ({
          ...thread.data(),
        }));

        setLiveSessions(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    loadThreads();
  }, []);

  return (
    <div className="">
      <h1>View Scheduled Upcoming Sessions</h1>
    </div>
  );
};

export default ViewScheduledUpcommingSessions;
