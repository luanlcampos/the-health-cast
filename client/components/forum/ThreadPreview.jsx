import { useEffect, useState } from "react";
import Link from "next/link";
import ReportModal from "@/components/Profile/ReportModal";
import { db } from "@/firebase/clientApp";
import { getDoc, doc } from "firebase/firestore";

const ThreadPreview = ({ thread }) => {
  const [user, setUser] = useState();
  const date = new Date(Date(thread.createdBy)).toDateString();

  useEffect(() => {
    getUserProfileData().then((data) => {
      const name = data.firstName + " " + data.lastName;

      setUser(name);
    });
  }, []);

  const getUserProfileData = async (/*authorID*/) => {
    const result = await getDoc(doc(db, "users", String(thread.authorId)));
    let userProfileData = result.data();
    console.log(`result: ${JSON.stringify(userProfileData)}`);

    return userProfileData;
    // return {
    //   props: {
    //     userProfileData,
    //   },
    // };
  };
  // getUserProfileData(thread.authorId);
  console.log(`userProfileData in ThreadPreview: ${getUserProfileData()}`);

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
          <div className="text-center">{user}</div>
        </div>
        <div className="w-1/2 border-r border-gray-400 p-4">
          <Link
            href={{
              pathname: `/thread/${thread.id}`,
              query: {
                currentThread: JSON.stringify(thread),
                author: JSON.stringify(user),
              },
            }}
            as={`/thread/${thread.id}`}
          >
            <h2 className="text-2xl pb-2 hover:cursor-pointer hover:underline">
              {thread.title}
            </h2>
          </Link>
          <p className="text-sm">{thread.desc}</p>
          <div className="follow-button ml-5">
            <ReportModal
              reportingThread={true}
              reportedUserData={getUserProfileData}
              reportedUserId={thread.authorId}
            ></ReportModal>
          </div>
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
