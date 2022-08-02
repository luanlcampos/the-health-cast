import { useEffect, useState } from "react";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";

import { useAuth } from "@/firebase/auth";
import SignedLayout from "@/components/Layout/SignedLayout";
import Link from "next/link";
import Loading from "@/components/Loading";

import { useRouter } from "next/router";

import { db } from "@/firebase/clientApp";
import LiveSessionPreview from "@/components/liveSession/LiveSessionPreview";

export default function Recordings() {
  const { user, userData, adminData } = useAuth();
  const [recordings, setRecordings] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [searchedRecordings, setSearchedRecordings] = useState(null);
  const [searchRecordingsField, setSearchRecordingsField] = useState("");
  const [useSearch, setUseSearch] = useState(false);

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

    const loadRecordings = async () => {
      try {
        // recording collection reference
        const recordingsReference = collection(db, "liveSessions");
        const listOfRecordingDocs = await getDocs(recordingsReference);
        const data = listOfRecordingDocs.docs.map((givenRecording) => {
          const user = loadUser(givenRecording.data().createdByHcpId);

          return {
            ...givenRecording.data(),
            id: givenRecording.id,
            user: user,
          };
        });
        console.log(`recordings: ` + JSON.stringify(data[0]));
        setRecordings(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    loadRecordings();
  }, []);

  useEffect(() => {
    let matchingRecords = [];
    const filterRecordings = async () => {
      try {
        //e.preventDefault();
        setSearchedRecordings(null);
//        console.log(`value (2nd useEffect): ${searchRecordingsField}`);

        //if (!recordings)
        //  console.log(`length: ${recordings.length}`);

        //console.log(`recordings is ${recordings.length}`);
        if (recordings) {
          matchingRecords = recordings.filter((recording) =>
            recording.title.toLowerCase().includes(searchRecordingsField.toLowerCase())
          );
//          console.log(
//            `searched recordings (matchingRecords): ${JSON.stringify(matchingRecords)}`
//          );
//          console.log(`matchingRecords.length: ${matchingRecords.length}`);

          setSearchedRecordings(matchingRecords);

          //if (matchingRecords.length > 0 && searchRecordingsField.length !== "")
          setUseSearch(true);
        }
        //else
        //  setUseSearch(false);
      } catch (err) {
        console.error(err);
      }
    };
    filterRecordings();

//    console.log(
//      `state (searchedRecordings): ${
//        !searchedRecordings ? 0 : searchedRecordings.length
//      }`
//    );
  }, [searchRecordingsField]);

  if (user && !userData && !adminData) {
    return <Loading />;
  }


  if (isLoading) {
    return <Loading />;
  }

  return (
    <SignedLayout>
      <div className="max-h-[calc(100vh-160px)] overflow-y-auto container-snap">
        {!isLoading && recordings && recordings.length > 0 && (
          <div className="px-3">
            <h1 className="text-3xl font-extrabold pb-1">Latest Recordings</h1>
            <div className="flex flex-1 md:w-1/3 justify-end md:justify-start py-2">
              {user && (
                <span className="relative w-full">
                  <input
                    type="search"
                    className="w-full bg-gray-200 rounded px-3 py-1 mb-5 focus:outline-none focus:shadow-outline appearance-none leading-normal"
                    placeholder="Search By Live Session Title ..."
                    onChange={(e) => setSearchRecordingsField(e.target.value)}
                    id="onChange={e=>{setSearchLSField(e.target.value); filterLiveSessions(e);}}"
                  />
                </span>
              )}
              <p>
                &nbsp;&nbsp;
                {/*!searchedRecordings? 0: searchedRecordings.length*/}
              </p>
            </div>            
            <div className="main-content-header flex flex-col gap-x-10">
              <h2 className="text-3xl font-semibold pb-5">
                Followed HCP&#39;s
              </h2>
            </div>
            <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 my-10">
              {isLoading && !recordings ? (
                <Loading />
              ) : useSearch && searchRecordingsField.length > 0 ? (
                  searchedRecordings
                    .filter(
                      (givenLiveSession) =>
                        userData.following.includes(
                          givenLiveSession.createdByHcpId
                        ) && givenLiveSession.isARecording
                    )
                    .map((givenLiveSession) => {
                      return (
                        <LiveSessionPreview
                          liveSession={givenLiveSession}
                          key={givenLiveSession.id}
                        ></LiveSessionPreview>
                      );
                    })
                ) : (
                recordings
                  .filter((givenLiveSession) =>
                    adminData
                      ? adminData.following.includes(
                          givenLiveSession.createdByHcpId
                        ) && givenLiveSession.isARecording
                      : userData.following.includes(
                          givenLiveSession.createdByHcpId
                        ) && givenLiveSession.isARecording
                  )
                  .map((givenLiveSession) => {
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
              <h2 className="text-3xl font-semibold my-5">
                Recommended HCP&#39;s
              </h2>
            </div>
            <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 my-10">
              {isLoading && !recordings ? (
                <Loading />
              ) : useSearch && searchRecordingsField.length > 0 ? (
                  searchedRecordings
                    .filter((givenLiveSession) =>
                      !userData.following.includes(
                        givenLiveSession.createdByHcpId
                      ) && givenLiveSession.isARecording
                    )
                    .map((givenLiveSession) => {
                      return (
                        <LiveSessionPreview
                          liveSession={givenLiveSession}
                          key={givenLiveSession.id}
                        ></LiveSessionPreview>
                      );
                    })
                ) : (
                recordings
                  .filter((givenLiveSession) =>
                    adminData
                      ? !adminData.following.includes(
                          givenLiveSession.createdByHcpId
                        ) && givenLiveSession.isARecording
                      : !userData.following.includes(
                          givenLiveSession.createdByHcpId
                        ) && givenLiveSession.isARecording
                  )
                  .map((givenLiveSession) => {
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
    </SignedLayout>
  );
}
