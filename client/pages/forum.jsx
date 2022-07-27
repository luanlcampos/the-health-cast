import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import ThreadPreview from "@/components/forum/ThreadPreview";
import Header from "@/components/Layout/Header";
import SideMenu from "@/components/Layout/SideMenu";
import Loading from "@/components/Loading";
import SignedLayout from "@/components/Layout/SignedLayout";
import Pagination from "@/components/Pagination/Pagination";

const Forum = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [threads, setThreads] = useState();
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchThreadField, setSearchThreadField] = useState("");
  const [searchedThreads, setSearchedThreads] = useState(null);
  const [useSearch, setUseSearch] = useState(false);

  const PageSize = 2;
  const [currentFollowedPage, setCurrentFollowedPage] = useState(1);
  const [currentRecPage, setCurrentRecPage] = useState(1);

  const [followingThreads, setFollowingThreads] = useState([]);
  const [recThreads, setRecThreads] = useState([]);

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

    const loadThreads = async () => {
      try {
        // thread collection reference
        const threadRef = collection(db, "threads");
        const threadSnap = await getDocs(threadRef);
        const data = threadSnap.docs.map((thread) => {
          const user = loadUser(thread.data().authorId);

          return {
            ...thread.data(),
            id: thread.id,
            user: user,
          };
        });

        setThreads(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    loadUser(user.uid).then((user) => setUserData(user));
    loadThreads();
  }, []);

  // search Thread useEffect
  useEffect(() => {
    let matchingThreads = [];
    const filterSearchedThreads = async () => {
      try {
        //e.preventDefault();
        setSearchedThreads(null);
        console.log(`value (2nd useEffect): ${searchThreadField}`);

        //if (!LiveSessions)
        //  console.log(`length: ${threads.length}`);

        console.log(`threads is ${threads.length}`);
        if (threads) {
          matchingThreads = threads.filter((thread) =>
            thread.title.toLowerCase().includes(searchThreadField.toLowerCase())
          );
          console.log(
            `searched threads (matchingThreads): ${JSON.stringify(
              matchingThreads
            )}`
          );
          console.log(`matchingLS.length: ${matchingThreads.length}`);
          setSearchedThreads(matchingThreads);
          setUseSearch(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    filterSearchedThreads();

    console.log(
      `state (searchedThreads): ${!searchedThreads ? 0 : searchedThreads.length
      }`
    );
  }, [searchThreadField]);

  useEffect(() => {
    const filterThreads = async () => {
      if (threads && userData) {
        const followingData = threads.filter(
          (thread) =>
            userData.following.includes(thread.authorId) ||
            user.uid === thread.authorId
        );

        console.log(followingData);

        setFollowingThreads(followingData);

        const recData = threads.filter(
          (thread) =>
            !userData.following.includes(thread.authorId) &&
            user.uid !== thread.authorId
        );
        console.log(recData);
        setRecThreads(recData);
      }
    };
    filterThreads();
  }, [threads]);

  let currentFollowedThreadData = useMemo(() => {
    const firstPageIndex = (currentFollowedPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;

    if (searchThreadField.length == 0 && followingThreads) {
      return followingThreads.slice(firstPageIndex, lastPageIndex);
    } else if (searchThreadField.length > 0 && searchedThreads)
      return searchedThreads.slice(firstPageIndex, lastPageIndex);
  }, [currentFollowedPage, followingThreads, searchedThreads]);

  let currentRecThreadData = useMemo(() => {
    const firstPageIndex = (currentRecPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;

    if (searchThreadField.length == 0 && recThreads) {
      return recThreads.slice(firstPageIndex, lastPageIndex);
    } else if (searchThreadField.length > 0 && searchedThreads)
      return searchedThreads.slice(firstPageIndex, lastPageIndex);
  }, [currentRecPage, recThreads, searchedThreads]);

  if (!user) {
    router.push("/login");
    return;
  }

  return (
    <div>
      <SignedLayout>
        <div className="w-full px-10 py-5">
          <h1 className="text-3xl font-bold pb-3">Latest Posts</h1>
          {user && (
            <span className="relative w-full">
              <input
                type="search"
                className="w-1/3 bg-gray-200 rounded px-3 py-1 my-5 focus:outline-none focus:shadow-outline appearance-none leading-normal"
                placeholder="Search By Forum Thread Title ..."
                onChange={(e) => setSearchThreadField(e.target.value)}
                id="onChange={e=>{setSearchLSField(e.target.value); filterLiveSessions(e);}}"
              />
            </span>
          )}
          <h2 className="text-2xl font">Followed HCP's</h2>
          <div className="border-b border-black mb-5"></div>

          <div className="pb-10">
            {isLoading && !threads && !userData ? (
              <Loading />
            ) : useSearch && searchThreadField.length > 0 ? (
              currentFollowedThreadData
                .filter(
                  (givenThread) =>
                    userData.following.includes(givenThread.authorId) ||
                    user.uid === givenThread.authorId
                )
                .map((thread) => {
                  return <ThreadPreview thread={thread} key={thread.id} />;
                })
            ) : !isLoading && userData ? (
              currentFollowedThreadData
                .filter(
                  (givenThread) =>
                    userData.following.includes(givenThread.authorId) ||
                    user.uid === givenThread.authorId
                )
                .map((thread) => {
                  return <ThreadPreview thread={thread} key={thread.id} />;
                })
            ) : (
              <Loading />
            )}
            {currentFollowedThreadData ? (
              <Pagination
                className="pagination-bar pt-3"
                currentPage={currentFollowedPage}
                totalCount={
                  searchedThreads
                    ? searchedThreads.length
                    : followingThreads.length
                }
                pageSize={PageSize}
                onPageChange={(page) => setCurrentFollowedPage(page)}
              />
            ) : (
              <Loading />
            )}
          </div>

          <h2 className="text-2xl font">Recommended HCP's</h2>
          <div className="border-b border-black mb-5"></div>

          {/* TODO: Recommended threads will be popluated here */}
          <div>
            {!isLoading && threads && userData ? (
              currentRecThreadData
                .filter(
                  (givenThread) =>
                    !userData.following.includes(givenThread.authorId) &&
                    user.uid !== givenThread.authorId
                )
                .map((thread) => {
                  return <ThreadPreview thread={thread} key={thread.id} />;
                })
            ) : (
              <Loading />
            )}
            {currentRecThreadData ? (
              <Pagination
                className="pagination-bar pt-3"
                currentPage={currentRecPage}
                totalCount={recThreads.length}
                pageSize={PageSize}
                onPageChange={(page) => setCurrentRecPage(page)}
              />
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </SignedLayout>
    </div>
  );
};

export default Forum;
