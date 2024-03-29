import Link from "next/link";
import ReportModal from "@/components/Profile/ReportModal";
import Loading from "@/components/Loading";
import { db } from "@/firebase/clientApp";
import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "@/firebase/auth";
import LiveSessionPreviewHyperLink from "./LiveSessionPreviewHyperLink";
import RecordingPreviewHyperLink from "./RecordingPreviewHyperLink";
import thumbnail from "../../public/images/general-thumbnail.png";
import liveThumbnail from "../../public/images/live-thumbnail.png";

const LiveSessionPreview = ({ liveSession }) => {
  // const date = new Date(Date(liveSession.createdAt)).toDateString();
  const [isLoading, setIsLoading] = useState(true);
  const [createdByHcp, setCreatedByHcp] = useState(null);

  const [reportedHCP, setReportedHCP] = useState({});
  const { user } = useAuth();

  const getUserProfileData = async () => {
    const result = await getDoc(
      doc(db, "users", String(liveSession.createdByHcpId))
    );
    let userProfileData = result.data();

    // report modal modifications
    const dataWithLsId = { ...userProfileData, liveSessId: liveSession.id };
    setReportedHCP(dataWithLsId);

    setIsLoading(false);
    return userProfileData;
  };
  useEffect(() => {
    getUserProfileData().then((data) => setCreatedByHcp(data));
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg drop-shadow-xl max-w-xs md:max-w-none overflow-hidden">
        <img
          src={liveSession.isARecording ? thumbnail.src : liveThumbnail.src}
          alt="thumbnail"
          className=" w-full"
        />
        <div className="p-3">
          <span className="text-sm text-primary">
            {isLoading ? (
              <Loading />
            ) : (
              <p>
                Hosted By:{" "}
                <Link
                  href={`/profile/${liveSession.createdByHcpId}`}
                  as={`/profile/${liveSession.createdByHcpId}`}
                >
                  <span className="hover:cursor-pointer hover:underline">
                    {createdByHcp.firstName} {createdByHcp.lastName}
                  </span>
                </Link>
              </p>
            )}
          </span>
          <div className="font-semibold text-xl leading-6 text-gray-700 my-2">
            {liveSession.isARecording ? (
              <RecordingPreviewHyperLink
                liveSession={liveSession}
              ></RecordingPreviewHyperLink>
            ) : (
              <LiveSessionPreviewHyperLink
                liveSession={liveSession}
              ></LiveSessionPreviewHyperLink>
            )}
          </div>
          <p className="paragraph-normal leading-6 text-gray-600 max-h-[50px] overflow-auto">
            {liveSession.description}
          </p>
          <div className="mt-3 block" href="#">
            {user.uid != liveSession.createdByHcpId && (
              <div className="follow-button inline-block align-middle">
                <ReportModal
                  reportingLive={true}
                  reportedUserData={reportedHCP}
                  reportedUserId={liveSession.createdByHcpId}
                ></ReportModal>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
