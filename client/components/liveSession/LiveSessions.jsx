import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import LiveSessionPreview from "./LiveSessionPreview";
import Loading from "@/components/Loading";
import { useAuth } from "@/firebase/auth";

const LiveSessions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [LiveSessions, setLiveSessions] = useState(null);
  const { user } = useAuth();
  const [searchedLiveSessions, setSearchedLiveSessions] = useState(null);
  const [searchLSField, setSearchLSField] = useState("");
  const [useSearch, setUseSearch] = useState(false);
  const [recommendedLives, setRecommendedLives] = useState(null);

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

      //finding sessions "LIVE" today
      var start = new Date();
      start.setUTCHours(0,0,0,0);

      var end = new Date();
      end.setUTCHours(23,59,59,999);

      console.log(`data[0].sessionScheduleDate: ${data[0].sessionScheduleDate.seconds}`);
//      const liveSessionsToday = data.filter(liveSession =>{
//        liveSessionDate = new Date(liveSession.sessionScheduleDate);
//        if (liveSessionDate > start.setUTCHours(0,0,0,0) && liveSessionDate < end.setUTcHours(23,59,59,999))
//          return liveSession;
//      })

// finding HCP creators
//        const usersRef = collection(db, "users");
//        const usersSnap = await getDocs(usersRef);
//        let users = usersSnap.docs.map(user => ({...user.data(), id: user.id}));
//        //console.log(`live session hcps: ${users[0].isHcp}`);
//
//        //console.log(`users.length: ${users.length}`);
//        //console.log(`find only hcp content creators`);
//        let hcps = [];
//        for (let i = 0; i < users.length; i++){
//          if (users[i].isHcp)
//            hcps.push(users[i].id);
//        }
//
//        console.log(`after finding: ${hcps.length}\nhcps: ${hcps}`)
//        console.log(`data.length: ${data.length}`);
//        let livesWithHCPInfo = [];
//        for (let i = 0; i < data.length; i++){
//          for (let j = 0; j < hcps.length; j++){
//            if (hcps[j] == data[i].createdByHcpId){
//              livesWithHCPInfo.push(data[i]);
//              //console.log(`data[i].createdByHcpId: ${data[i].createdByHcpId} && hcps[j]: ${hcps[j]}`)
//            }
//          }
//        }
//        console.log(`lives with HCP info: ${livesWithHCPInfo.length}\nlives With HCP info: ${JSON.stringify(livesWithHCPInfo)}`);
        
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
    <div className="max-h-[calc(100vh-160px)] overflow-auto">
      {!isLoading && LiveSessions.length > 0 && (
        <div>
          <div className="flex flex-1 md:w-1/3 justify-end md:justify-start px-2 py-4">
            {user && (
              <span className="relative w-full">
                <input
                  type="search"
                  className="w-full bg-gray-200 rounded-full px-3 py-1 focus:outline-none focus:shadow-outline appearance-none leading-normal"
                  placeholder="Search By Live Session Title ..."
				  onChange={e=>setSearchLSField(e.target.value)}
                  id="onChange={e=>{setSearchLSField(e.target.value); filterLiveSessions(e);}}"
                />
              </span>
            )}
            <p>&nbsp;&nbsp;{!searchedLiveSessions? 0: searchedLiveSessions.length}</p>
          </div>
          <div className="main-content-header flex flex-col gap-x-10">
            <h1 className="text-3xl font-bold pb-5">Live Now</h1>
          </div>
          <div className="card-list flex flex-row flex-wrap justify-between w-full">
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
            <h1 className="text-3xl font-bold my-5">Recommended HCP&#39;s</h1>
          </div>
          <div className="card-list flex flex-row flex-wrap justify-between w-full ">
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
