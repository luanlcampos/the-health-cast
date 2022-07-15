import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import LiveSessionPreview from "./LiveSessionPreview";
import Loading from "@/components/Loading";
import { useAuth } from "@/firebase/auth";

const LiveSessions = ({ userData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [LiveSessions, setLiveSessions] = useState(null);
  const { user } = useAuth();
  const [searchedLiveSessions, setSearchedLiveSessions] = useState(null);
  const [searchLSField, setSearchLSField] = useState("");
  const [useSearch, setUseSearch] = useState(false);
  const [recommendedLives, setRecommendedLives] = useState(null);
  const [livesToday, setLivesToday] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    const loadLiveSessions = async () => {
      try {
        // thread collection reference
        const liveSessionsRef = collection(db, "liveSessions");
        const liveSessionsSnap = await getDocs(liveSessionsRef);
        let data = liveSessionsSnap.docs.map((givenLiveSession) => ({
          ...givenLiveSession.data(),
          id: givenLiveSession.id,
		      searchTitle: givenLiveSession.data().title.toLowerCase(),
        }));

//		console.log(`loadLiveSessions: ${JSON.stringify(data)}`);
			setLiveSessions(data);

      /***************** finding sessions "LIVE" today *********************/
      var start = new Date();
      start.setUTCHours(0,0,0,0);

      var end = new Date();
      end.setUTCHours(23,59,59,999);

      console.log(`data[0].sessionScheduleDate: ${data[0].sessionScheduleDate.seconds}`);
      const liveSessionsToday = data.filter(liveSession =>{
        let liveSessionDate = liveSession.sessionScheduleDate.seconds * 1000;
        console.log(`liveSessionDate: ${liveSessionDate} | start: ${start.setUTCHours(0,0,0,0)} | end: ${end.setUTCHours(23,59,59,999)}`);
        if (liveSessionDate > start.setUTCHours(0,0,0,0) && liveSessionDate < end.setUTCHours(23,59,59,999))
          return liveSession;
      })
      console.log(`liveSessionsToday: ${liveSessionsToday}`);
      setLivesToday(liveSessionsToday);        
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    loadLiveSessions();
  }, []);
     
  useEffect(()=>{
    let matchingLS = [];
    const filterLiveSessions = async () => {
      try {
        //e.preventDefault();
        setSearchedLiveSessions(null);
        console.log(`value (2nd useEffect): ${searchLSField}`);

        //if (!LiveSessions)
        //  console.log(`length: ${LiveSessions.length}`);
        
        //console.log(`LiveSessions is ${LiveSessions.length}`);
        if (LiveSessions){
        matchingLS = LiveSessions.filter(live => live.searchTitle.toLowerCase().includes(searchLSField.toLowerCase()));
        console.log(`searched Lives (matchingLS): ${JSON.stringify(matchingLS)}`);
        console.log(`matchingLS.length: ${matchingLS.length}`);

        setSearchedLiveSessions(matchingLS);

        //if (matchingLS.length > 0 && searchLSField.length !== "")
          setUseSearch(true);
          }
        //else
        //  setUseSearch(false);
      } catch (err){
        console.error(err);
      }
    }
    filterLiveSessions();

    console.log(`state (searchedLiveSessions): ${!searchedLiveSessions? 0: searchedLiveSessions.length}`);
  }, [searchLSField]);
  
  return (
    <div className="max-h-[calc(100vh-160px)] overflow-y-auto container-snap">
      {!isLoading && LiveSessions.length > 0 && (
        <div className="px-3">
          <h1 className="text-3xl font-extrabold pb-1">Latest Live Sessions</h1>
          <div className="flex flex-1 md:w-1/3 justify-end md:justify-start py-2">
            {user && (
              <span className="relative w-full">
                <input
                  type="search"
                  className="w-full bg-gray-200 rounded px-3 py-1 mb-5 focus:outline-none focus:shadow-outline appearance-none leading-normal"
                  placeholder="Search By Live Session Title ..."
				  onChange={e=>setSearchLSField(e.target.value)}
                  id="onChange={e=>{setSearchLSField(e.target.value); filterLiveSessions(e);}}"
                />
              </span>
            )}
            <p>&nbsp;&nbsp;{/*!searchedLiveSessions? 0: searchedLiveSessions.length*/}</p>
          </div>
          <div className="main-content-header flex flex-col gap-x-10">
            <h2 className="text-3xl font-semibold pb-5">Live Now</h2>
          </div>
          <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 my-10">
            {isLoading && !LiveSessions ? (
              <Loading />
            ) : (
              useSearch && searchLSField.length > 0? (
                searchedLiveSessions.map((givenLiveSession) => {
                return (
                  <LiveSessionPreview
                    liveSession={givenLiveSession}
                    key={givenLiveSession.id}
                  ></LiveSessionPreview>
                );
              })
            ) : (LiveSessions.map((givenLiveSession) => {
                return (
                  <LiveSessionPreview
                    liveSession={givenLiveSession}
                    key={givenLiveSession.id}
                  ></LiveSessionPreview>
                );
              }))
            )}
          </div>
          {/* Recommended Lives */}
          <div className="main-content-header flex flex-col gap-x-10">
            <h2 className="text-3xl font-semibold my-5">Recommended HCP&#39;s</h2>
          </div>
          <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 my-10">
            {isLoading && !LiveSessions ? (
              <Loading />
            ) : (
              useSearch && searchLSField.length > 0? (
                searchedLiveSessions.map((givenLiveSession) => {
                return (
                  <LiveSessionPreview
                    liveSession={givenLiveSession}
                    key={givenLiveSession.id}
                  ></LiveSessionPreview>
                );
              })
            ) : (LiveSessions.map((givenLiveSession) => {
                return (
                  <LiveSessionPreview
                    liveSession={givenLiveSession}
                    key={givenLiveSession.id}
                  ></LiveSessionPreview>
                );
              }))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSessions;
