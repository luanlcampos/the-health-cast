import Link from "next/link";

import ReportModal from "@/components/Profile/ReportModal";
import { db } from "@/firebase/clientApp";
import { getDoc, doc, getDocs } from "firebase/firestore";
import { useAuth } from "@/firebase/auth";
import { useEffect, useState } from "react";
import Loading from "../Loading";

const ThreadPreview = ({ thread }) => {
  const date = new Date(Date(thread.createdBy)).toDateString();
  const { user } = useAuth();
  const [creatorData, setCreatorData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const loadCreatorData = async () => {
      try {
        const result = await getDoc(doc(db, "users", String(thread.authorId)));
        const data = { ...result.data(), threadId: thread.id };

        setCreatorData(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    loadCreatorData();
  }, []);
  // console.log(`in ThreadPreview 2: ${JSON.stringify(creatorData)}`);

  return (
    <div className="bg-white mb-8 rounded-xl drop-shadow-lg border-2 border-gray-100">
      <div className="flex rounded-xl p-2">
        <div className="min-w-[150px]">
          <img
            src="https://via.placeholder.com/125"
            width="150px"
            height="150px"
            className="p-4"
          />
          <div className="text-center">
            {creatorData.firstName ? (
              creatorData.firstName + " " + creatorData.lastName
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className="w-1/2 border-r border-gray-400 p-4">
          <Link href={`/thread/${thread.id}`}>
            <h2 className="text-2xl pb-2 hover:cursor-pointer hover:underline">
              {thread.title}
            </h2>
          </Link>
          <p className="text-sm">{thread.desc}</p>
          {user.uid != thread.authorId && (
            <div className="follow-button inline-block align-middle">
              <ReportModal
                reportingThread={true}
                reportedUserData={creatorData /*getUserProfileData*/}
                reportedUserId={thread.authorId}
              ></ReportModal>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="grow flex pb-4">
            <div className="mr-7">
              <h4 className="text-gray-400">Replies</h4>
              <div className="text-center">{thread.replies.length}</div>
            </div>
          </div>
          <h4 className="text-gray-400">Activity</h4>
          <div>{date}</div>
        </div>
      </div>
    </div>
  );
};

export default ThreadPreview;
