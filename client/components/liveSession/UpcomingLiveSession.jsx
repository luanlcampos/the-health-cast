import Link from "next/link";
import ReportModal from "@/components/Profile/ReportModal";
import Loading from "@/components/Loading";
import { db } from "@/firebase/clientApp";
import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/firebase/auth";
import { set } from "react-hook-form";

// pagination
import Pagination from "../Pagination/Pagination";

const PageSize = 2;

const UpcomingLiveSession = ({ upcomingLives, upcomingDate }) => {
  // const date = new Date(Date(upcomingLives.createdAt)).toDateString();
  const [isLoading, setIsLoading] = useState(true);
  const [liveSessionsByDate, setLiveSessionsByDate] = useState([]);

  const [reportedHCP, setReportedHCP] = useState({});
  const { user } = useAuth();

  const [loadingLiveSessions, setLoadingLiveSessions] = useState(false);

  const addUserDetailsToLiveSession = async (liveSessions) => {
    console.log(
      `liveSessionsByDate.length (addUserDetailsToLiveSession): ${liveSessions.length}`
    );
    let userProfileData = {};

    let liveSessionsByDateWithUserDetails = [];
    for (let i = 0; i < liveSessions.length; i++) {
      const result = await getDoc(
        doc(db, "users", String(liveSessions[i].createdByHcpId))
      );
      userProfileData = result.data();
      const dataWithLsId = {
        ...liveSessions[i],
        userProfileData,
        liveSessId: upcomingLives.id,
      };
      // console.log(`dataWithLSId: ${JSON.stringify(dataWithLsId)}`);
      liveSessionsByDateWithUserDetails.push(dataWithLsId);
      setReportedHCP(userProfileData);
    }
    // console.log(userProfileData);

    // report modal modifications
    setLiveSessionsByDate(liveSessionsByDateWithUserDetails);

    console.log(liveSessionsByDate);
    setIsLoading(false);
  };

  const loadUpcomingSessionsByDate = async () => {
    // console.log(`upcomingDate in upcomingLiveSession: `, upcomingDate);

    let liveSessionsAtUpcomingDate = [];
    for (let i = 0; i < upcomingLives.length; i++) {
      //   console.log(`live sess in upcomingLiveSession: `, upcomingLives[i]);
      let liveSessionScheduledDate = new Date(
        upcomingLives[i].sessionScheduleDate.seconds * 1000
      );
      let currDate = new Date(upcomingDate);
      let nextDate = new Date(currDate);
      nextDate.setDate(currDate.getDate() + 1);

      // // console.log(
      // //   `BEFORE if condition ...\n`,
      // //   `session scheduled date: ${liveSessionScheduledDate}`,
      // //   ` && upcomingDate: ${currDate}`,
      // //   ` && nextUpcomingDate: ${nextDate}`
      // // );

      if (
        currDate <= liveSessionScheduledDate &&
        liveSessionScheduledDate < nextDate
      ) {
        liveSessionsAtUpcomingDate.push(upcomingLives[i]);
      }
    }
    // console.log(
    //   `Array "liveSessionsAtUpcomingDate": ${liveSessionsAtUpcomingDate.length}`
    // );
    setLiveSessionsByDate(liveSessionsAtUpcomingDate);
    addUserDetailsToLiveSession(liveSessionsAtUpcomingDate);
  };

  useEffect(() => {
    const getUpcomingLiveSessions = async () => {
      await loadUpcomingSessionsByDate();
    };
    console.log(
      `useEffect: ${liveSessionsByDate} \n upcomingLives ${upcomingLives.length}`
    );
    setLoadingLiveSessions(true);

    getUpcomingLiveSessions();
    setLoadingLiveSessions(false);
  }, []);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  let currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    console.log(lastPageIndex, ` ... lastPageIndex`);
    return liveSessionsByDate.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, liveSessionsByDate]);
  console.log(`currentTableData.length: `, currentTableData.length);

  return (
    <div>
      <div>
        {isLoading && !liveSessionsByDate ? (
          <Loading />
        ) : (
          currentTableData.map((liveSession, index) => {
            return (
              // <div className="card-item shadow-lg rounded-xl grow mx-10">
              <div
                className="card-item shadow-lg rounded-xl grow my-5"
                key={index}
              >
                <div className="card-item-thumbnail">
                  <img
                    src="https://via.placeholder.com/315x180"
                    alt="thumbnail"
                    className="rounded-t-xl"
                  />
                </div>
                <div className="card-item-content p-5">
                  <Link
                    href={{
                      pathname: `/livesession/${liveSession.id}`,
                      query: { liveSessionId: liveSession.id },
                    }}
                    as={`/livesession/${liveSession.id}`}
                  >
                    <h2 className="text-2xl pb-2 hover:cursor-pointer hover:underline">
                      {liveSession.title}
                    </h2>
                  </Link>
                  <p>{liveSession.description}</p>
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <p>
                      Hosted By:{" "}
                      {liveSession.userProfileData
                        ? liveSession.userProfileData.firstName
                        : ""}{" "}
                      {liveSession.userProfileData
                        ? liveSession.userProfileData.lastName
                        : ""}
                    </p>
                  )}
                  {user.uid != liveSession.createdByHcpId && (
                    <div className="follow-button inline-block align-middle">
                      <ReportModal
                        reportingLive={true}
                        reportedUserData={reportedHCP}
                        reportedUserId={liveSession.createdByHcpId}
                      ></ReportModal>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={liveSessionsByDate.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default UpcomingLiveSession;
