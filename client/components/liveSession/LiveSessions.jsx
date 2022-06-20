import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import LiveSessionPreview from "./LiveSessionPreview";
import Loading from "@/components/Loading";

const LiveSessions = () => {
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
        console.log(err);
      }
    };

    loadLiveSessions();
  }, []);

  return (
    <div className="outline">
      {!isLoading && LiveSessions.length > 0 && (
        <div className="outline">
          <div className="card-list flex flex-row flex-wrap justify-between w-full">
            {isLoading && !LiveSessions ? (
              <Loading />
            ) : (
              LiveSessions.map((givenLiveSession) => {
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
              LiveSessions.map((givenLiveSession) => {
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

/**
 * What is expected to come
 * [
    {
        "mediaId": 1005,
        "reports": [],
        "startTime": "",
        "updatedAt": {
            "seconds": 1654368509,
            "nanoseconds": 764000000
            
        "endTime": "",
        "interests": [
            "Abdominal Aortic Aneurysm",
            "Abdominal Pregnancy",
            "Accident Prevention",
            "ABO Blood Groups"
            
        "createdByHcpId": "kaDktup32QT2XovYMxEVHpEaIgG3",
        "isRecording": false,
        "description": "hello",
        "title": "test",
        "isARecording": false,
        "isOngoing": false,
        "liveSessionDuration": 0,
        "createdAt": {
            "seconds": 1654368509,
            "nanoseconds": 764000000
            
        "sessionScheduleDate": {
            "seconds": 1654368508,
            "nanoseconds": 695000000
        }
      },
      {
        "endTime": "",
        "sessionScheduleDate": {
            "seconds": 1654368779,
            "nanoseconds": 933000000
            
        "updatedAt": {
          "seconds": 1654368780,
            "nanoseconds": 808000000
            
        "isRecording": false,
        "title": "poppy",
        "createdAt": {
            "seconds": 1654368780,
            "nanoseconds": 808000000
            
        "createdByHcpId": "kaDktup32QT2XovYMxEVHpEaIgG3",
        "reports": [],
        "startTime": "",
        "mediaId": 1005,
        "isOngoing": false,
        "liveSessionDuration": 0,
        "description": "tell me",
        "isARecording": false,
        "interests": [
            "AAA",
            "Acquired Immunodeficiency Syndrome",
            "Acid Reflux",
            "Adenovirus Infections"
          ]
    }
    
  ]

  */

// OLD USE EFFECT
// useEffect(() => {
//   setIsLoading(true);
//   const loadLiveSessions = async () => {
//     try {
//       // LiveSession collection reference
//       const LiveSessionRef = collection(db, "liveSessions");
//       const LiveSessionSnap = await getDocs(LiveSessionRef);
//       const data = LiveSessionSnap.docs.map((LiveSession) => {
//         return {
//           ...LiveSession.data(),
//           id: LiveSession.id,
//         };
//       });

//       data.forEach((data)=>{
//         console.log(`current live sessions on fb:`, data);
//       })

//       setLiveSessions(data);
//       setIsLoading(false);

//       return data;
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const loadHCPInfo = async (givenID) => {
//     try {
//       const docRef = doc(db, "users", `${givenID}`);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists() && docSnap.data().isHcp) {
//         return docSnap.data();
//       } else {
//         throw new Error("No such document");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   loadLiveSessions().then((data) => {
//     const tmp = [];
//     data.forEach((givenItem) => {
//       loadHCPInfo(givenItem.createdByHcpId)
//         .then((hcp) => {
//           tmp.push(hcp);
//         })
//         .then(() => setHcpUserSetData(tmp));
//     });
//   });
// }, []);
