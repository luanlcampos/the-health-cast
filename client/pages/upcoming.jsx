import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import Header from "@/components/Layout/Header";
import SideMenu from "@/components/Layout/SideMenu";
import Loading from "@/components/Loading";

import UpcomingPreview from "@/components/liveSession/UpcomingPreview";

const Upcoming = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [liveSessions, setLiveSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

    const loadLiveSessions = async () => {
      try {
        // thread collection reference
        const liveSessionsRef = collection(db, "liveSessions");
        const liveSessionsSnap = await getDocs(liveSessionsRef);
        const data = liveSessionsSnap.docs.map((liveSession) => {
          const hcpCreator = loadUser(liveSession.data().createdByHcpId);

          return {
            ...liveSession.data(),
            id: liveSession.id,
            createdByHcp: hcpCreator,
          };
        });

        setLiveSessions(data);
      } catch (err) {
        console.log(err);
      }
    };

    loadLiveSessions();
    setIsLoading(false);
  }, []);

  console.log(
    `liveSessions: `,
    liveSessions,
    ` && liveSessions Length: `,
    liveSessions.length
  );

  if (!user) {
    router.push("/login");
    return;
  }

  return (
    <div>
      <div>
        <Header user={user} />
        <div className="flex main-container h-[calc(100vh-70px)]">
          <div className="side-menu w-2/12 min-w-[200px]">
            <SideMenu />
          </div>
          <div className="w-full px-10 py-5">
            {liveSessions.length > 0 ? (
              <UpcomingPreview upcomingLiveSessions={liveSessions} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upcoming;
