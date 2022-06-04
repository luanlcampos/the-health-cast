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
        console.log(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    loadThreads();
  }, []);
  
  return (
    <div className="outline outline-blue-500">
      <h1>View Scheduled Upcoming Sessions</h1>
    </div>
  );
};

export default ViewScheduledUpcommingSessions;
