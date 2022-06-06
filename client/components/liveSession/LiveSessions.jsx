import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";

const LiveSessions = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Using parallel arrays
  const [LiveSessions, setLiveSessions] = useState(null);
  const [hcpUserSetData, setHcpUserSetData] = useState([]);
  const [onlyOnce, setOnlyOnce] = useState(0);
  useEffect(() => {
    setIsLoading(true);
    setOnlyOnce((prevState) => prevState + 1);
    const loadLiveSessions = async () => {
      try {
        // LiveSession collection reference
        const LiveSessionRef = collection(db, "liveSessions");
        const LiveSessionSnap = await getDocs(LiveSessionRef);
        const data = LiveSessionSnap.docs.map((LiveSession) => {
          return {
            ...LiveSession.data(),
          };
        });
        console.log("happening once", onlyOnce);
        setLiveSessions(data);

        data.forEach((givenItem) => {
          const loadHCPInfo = async (givenID) => {
            try {
              const docRef = doc(db, "users", `${givenID}`);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                docSnap.data().isHcp &&
                  console.log("Document data:", docSnap.data());
                return setHcpUserSetData((prevState) => [
                  ...prevState,
                  { ...docSnap.data() },
                ]);
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                throw new Error("No such document");
              }
            } catch (err) {
              console.log(err);
            }
          };
          loadHCPInfo(givenItem.createdByHcpId).then((res) =>
            console.log("HELLO WORLD")
          );
        });

        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    loadLiveSessions();
  }, []);

  return (
    <div className="outline ">
      {!isLoading &&
        LiveSessions.length !== 0 &&
        hcpUserSetData.length !== 0 &&
        LiveSessions.length == hcpUserSetData.length && (
          <div className="outline ">
            <div className="card-list flex flex-row flex-wrap justify-between w-full ">
              {LiveSessions.map((givenLiveSession, index) => (
                <div className="card-item" key={index}>
                  <div className="card-item-thumbnail">
                    <img
                      src="https://via.placeholder.com/315x180"
                      alt="thumbnail"
                    />
                  </div>
                  <div className="card-item-content">
                    <h3>{givenLiveSession.title}</h3>
                    <p>{givenLiveSession.description}</p>
                    <p>
                      Hosted By:
                      {`${hcpUserSetData[index].firstName} ${hcpUserSetData[index].lastName}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Recommended Lives */}
            <div className="main-content-header flex flex-col gap-x-10">
              <h1 className="text-3xl font-bold pb-5">Recommended HCP&#39;s</h1>
            </div>
            <div className="card-list flex flex-row flex-wrap justify-between w-full ">
              {LiveSessions.map((givenLiveSession, index) => (
                <div className="card-item" key={index}>
                  <div className="card-item-thumbnail">
                    <img
                      src="https://via.placeholder.com/315x180"
                      alt="thumbnail"
                    />
                  </div>
                  <div className="card-item-content">
                    <h3>{givenLiveSession.title}</h3>
                    <p>{givenLiveSession.description}</p>
                    <p>
                      Hosted By:
                      {`${hcpUserSetData[index].firstName} ${hcpUserSetData[index].lastName}`}
                    </p>
                  </div>
                </div>
              ))}
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
        },
        "endTime": "",
        "interests": [
            "Abdominal Aortic Aneurysm",
            "Abdominal Pregnancy",
            "Accident Prevention",
            "ABO Blood Groups"
        ],
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
        },
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
        },
        "updatedAt": {
            "seconds": 1654368780,
            "nanoseconds": 808000000
        },
        "isRecording": false,
        "title": "poppy",
        "createdAt": {
            "seconds": 1654368780,
            "nanoseconds": 808000000
        },
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
