import Link from "next/link";
import ReportModal from "@/components/Profile/ReportModal";
import Loading from "@/components/Loading";
import { db } from "@/firebase/clientApp";
import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

const userProfileData = null;

const LiveSessionPreview = ({ liveSession }) => {
  console.log(liveSession);
  // const date = new Date(Date(liveSession.createdAt)).toDateString();
  const [isLoading, setIsLoading] = useState(true);
  const [createdByHcp, setCreatedByHcp] = useState(null);
  const getUserProfileData = async () => {
    const result = await getDoc(
      doc(db, "users", String(liveSession.createdByHcpId))
    );
    let userProfileData = result.data();
    console.log(`result: ${JSON.stringify(userProfileData)}`);
    isLoading = true;
    return userProfileData;
  };
  // getUserProfileData(liveSession.authorId);
  useEffect(() =>{
    
  })
  console.log(`userProfileData in LiveSessionPreview: ${await getUserProfileData()}`);

  return (
    <div className="card-item shadow-lg rounded-xl grow mx-10">
      <div className="card-item-thumbnail">
        <img
          src="https://via.placeholder.com/315x180"
          alt="thumbnail"
          className="rounded-t-xl"
        />
      </div>
      <div className="card-item-content p-5">
        <h3>{liveSession.title}</h3>
        <p>{liveSession.description}</p>
        <p>
          {isLoading  ? (
            <Loading />
          ) : (
            <> Hosted By: Hello World</>
          )}
        </p>
      </div>
    </div>
  );
};

export default LiveSessionPreview;

// <div className="bg-white mb-8 rounded-xl drop-shadow-lg border-2 border-gray-100">
//   <div className="flex rounded-xl p-2">
//     <div className="min-w-[150px]">
//       <img
//         src="https://via.placeholder.com/125"
//         width="150px"
//         height="150px"
//         className="p-4"
//       />
//       <div className="text-center">{liveSession.authorId}</div>
//     </div>
//     <div className="w-1/2 border-r border-gray-400 p-4">
//       <Link
//         href={{
//           pathname: `/liveSession/${liveSession.id}`,
//           query: { liveSessionId: liveSession.id },
//         }}
//         as={`/liveSession/${liveSession.id}`}
//       >
//         <h2 className="text-2xl pb-2 hover:cursor-pointer hover:underline">
//           {liveSession.title}
//         </h2>
//       </Link>
//       <p className="text-sm">{liveSession.desc}</p>
//       <div className="follow-button ml-5">
//         <ReportModal
//         //   reportingLiveSession={true}
//           reportedUserData={getUserProfileData}
//           reportedUserId={liveSession.authorId}
//         ></ReportModal>
//       </div>
//     </div>
//     <div className="p-4">
//       <div className="grow flex pb-4">
//         <div className="mr-7">
//           <h4 className="text-gray-400">Replies</h4>
//           <div className="text-center">{liveSession.replies.length}</div>
//         </div>
//         <div>
//           <h4 className="text-gray-400">Users</h4>
//           <div className="text-center">+10</div>
//         </div>
//       </div>
//       <h4 className="text-gray-400">Activity</h4>
//       <div>{date}</div>
//     </div>
//   </div>
// </div>