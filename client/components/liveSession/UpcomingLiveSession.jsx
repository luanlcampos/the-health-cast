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

const PageSize = 3;

const UpcomingLiveSession = ({ upcomingLives, upcomingDate }) => {
  // const date = new Date(Date(upcomingLives.createdAt)).toDateString();
  const [isLoading, setIsLoading] = useState(true);
  const [liveSessionsByDate, setLiveSessionsByDate] = useState([]);

  const [reportedHCP, setReportedHCP] = useState({});
  const { user } = useAuth();

  const [loadingLiveSessions, setLoadingLiveSessions] = useState(false);
  const [date, setDate] = useState("");

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
      let tmpDate = new Date(liveSessions[i].sessionScheduleDate.seconds * 1000); 
      console.log(`tmpDate: ${tmpDate}`);

      const dataWithLsId = {
        ...liveSessions[i],
        userProfileData,
        liveSessId: upcomingLives.id,
        upcomingTime: tmpDate.toLocaleTimeString().substr(0,5).concat(" " + tmpDate.toLocaleTimeString().substr(-2)),
      };
      //console.log(`dataWithLSId: ${JSON.stringify(dataWithLsId)}`);
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

      setDate(currDate.toDateString());
      if (
        currDate <= liveSessionScheduledDate &&
        liveSessionScheduledDate < nextDate
      ) {
        liveSessionsAtUpcomingDate.push(upcomingLives[i]);
      }
    }

    setLiveSessionsByDate(liveSessionsAtUpcomingDate);
    await addUserDetailsToLiveSession(liveSessionsAtUpcomingDate);
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
    <div className="container w-full lg:w-full mx-auto flex flex-col">          
        {isLoading && !liveSessionsByDate ? (
          <Loading />
        ) : ( liveSessionsByDate.length > 0?
          (currentTableData.map((liveSession, index) => {
            return (
              // <div className="card-item shadow-lg rounded-xl grow mx-10">
              <div className="grid flex flex-col md:flex-row bg-white rounded-lg shadow-xl  mt-4 w-100 mx-2" key={index}>
                <div className='relative m-0 flex bg-white rounded-lg'>
                  <div className='flex-no-shrink'>
                    <img alt='' className='rounded-l-lg inset-0 h-full w-full object-cover object-center' src='https://via.placeholder.com/315x180' />
                  </div>
                  <div className='flex-1 card-block relative grid grid-cols-3'>
                    <div className="p-6 col-span-2">
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
                      <p className='leading-normal'>{liveSession.description}</p>
                      <p className="mt-2">
                        Hosted By:{" "}
                        {isLoading ? (
                          <Loading />
                        ) : (
                          <Link
                            href={`/profile/${liveSession.createdByHcpId}`}
                            as={`/profile/${liveSession.createdByHcpId}`}
                          >                      
                            <span className="hover:cursor-pointer hover:underline">

                              {liveSession.userProfileData
                                ? liveSession.userProfileData.firstName
                                : ""}{" "}
                              {liveSession.userProfileData
                                ? liveSession.userProfileData.lastName
                                : ""}
                            </span>
                          </Link>                        
                        )}
                      </p>
                      {user.uid != liveSession.createdByHcpId && (
                        <div className="follow-button inline-block align-middle pt-3 text-sm">
                          <ReportModal
                            reportingLive={true}
                            reportedUserData={reportedHCP}
                            reportedUserId={liveSession.createdByHcpId}
                          ></ReportModal>
                        </div>
                      )}
                      <a className='-m-4 w-12 h-12 bg-blue-dark flex items-center justify-center text-center no-underline rounded-full text-white hover:bg-blue-darker absolute pin-t pin-r' href='#'>
                        <i className='text-xl fa fa-plus'></i>
                      </a>
                    </div>
                    <div className="p-6">
                      Live at:
                      <p className="h-full text-2xl">{liveSession.upcomingTime}</p>
                    </div>          
                  </div>
                </div>
              </div>
            );
          })) : (<div>No lives currently scheduled on {date}.</div>)
        )}
      <Pagination
        className="pagination-bar pt-3"
        currentPage={currentPage}
        totalCount={liveSessionsByDate.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default UpcomingLiveSession;
