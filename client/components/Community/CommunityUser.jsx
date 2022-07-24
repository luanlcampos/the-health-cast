import Link from "next/link";
import ReportModal from "@/components/Profile/ReportModal";
import Loading from "@/components/Loading";
import { db } from "@/firebase/clientApp";
import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/firebase/auth";
import { set } from "react-hook-form";
import { Avatar } from "@mui/material";
import Image from "next/image";

// pagination content limit per page
const PageSize = 3;

const UpcomingLiveSession = ({ account }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [reportedHCP, setReportedHCP] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    console.log(`account in CommunityUser: ${account}`);
    console.log(`followers in CommunityUser: ${account.followers}`);
  }, []);

  const getUserInitials = () => {
    // if user is an admin
    const orgInitials = "";


    return orgInitials.toUpperCase();
  };

  return (
//    <div className="grid flex flex-col md:flex-row bg-white rounded-lg shadow-xl  mt-4 w-100 mx-2">
//      <img src="https://i.imgur.com/dYcYQ7E.png" class="w-full" />
//      <div class="flex justify-center -mt-8">
//          <img src="https://i.imgur.com/8Km9tLL.jpg" class="rounded-full border-solid border-white border-2 -mt-3"/>   
//      </div>    
//      {account.id}
//    </div>
// <img className="w-32 mx-auto mt-2 rounded-full border-8 border-white" src="https://th.bing.com/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgHaHw?pid=ImgDet&rs=1" alt="profile avatar"/>
// <span className="text-xl">{account.firstName[0].toUpperCase()}{" "}{ account.lastName[0].toUpperCase()}</span>
      <div className="bg-gray-190 font-sans w-full flex flex-row justify-center items-center rounded-lg">
        <div className="card w-96 mx-auto bg-white h-full shadow-xl hover:shadow rounded">
           <Link
             href={{
               pathname: `/profile/${account.id}`,
               query: { accountId: account.id },
             }}
             as={`/profile/${account.id}`}
           >        
              <div className="user-avatar pt-1">
                <Avatar
                  sx={{ width: "135px", height: "135px", bgcolor: "#9FC131" }}
                  className="w-32 mx-auto rounded-full border-8 border-white cursor-pointer" 
                >
                  <span className="text-4xl">
                    {account.initials}
                  </span>                  
                </Avatar>
              </div>
           </Link>           

           <div className="text-center mt-2 text-3xl font-medium">{account.firstName} {account.lastName}</div>
           <div className="text-center mt-2 font-light text-sm">{/*@devpenzil*/}</div>
           <div className="text-center font-normal text-lg">
              {account.hcpOrg ? (
                <span>
                  {account.hcpOrg.orgName}
                  <Image src="/images/hcpLogo.svg" width="30px" height="30px" />
                </span>
              ) : (
                <br />
              )}
           </div>
           <div className="px-6 text-center mt-2 font-light text-sm">
             <p className="text-ellipsis truncate ...">
               {account.biography? account.biography : <br/>}
             </p>
           </div>
           <hr className="mt-8"/>
           <div className="flex p-4">
             <div className="w-1/2 text-center">
               <span className="font-bold">{account.followers? account.followers.length : 0}</span> Followers
             </div>
             <div className="w-0 border border-gray-300"></div>
             <div className="w-1/2 text-center">
               <span className="font-bold">{account.following? account.following.length : 0}</span> Following
             </div>
             <div className="w-0 border border-gray-300"></div>
             <div className="w-1/2 text-center">
               <span className="font-bold">
                  {user.uid != account.id && (
                        <div className="follow-button inline-block align-middle text-sm">
                        <ReportModal
                        reportingLive={true}
                        reportedUserData={account}
                        reportedUserId={account.id}
                        ></ReportModal>
                        </div>
                  )}               
               </span> 
             </div>
           </div>
        </div>
      </div>
//    <div className="grid flex flex-col md:flex-row bg-white rounded-lg shadow-xl  mt-4 w-100 mx-2" key={index}>
//      <div className='relative m-0 flex bg-white rounded-lg'>
//        <div className='flex-no-shrink'>
//          <img alt='' className='rounded-l-lg inset-0 h-full w-full object-cover object-center' src='https://via.placeholder.com/315x180' />
//        </div>
//        <div className='flex-1 card-block relative grid grid-cols-3'>
//          <div className="p-6 col-span-2">
//            <Link
//              href={{
//                pathname: `/livesession/${liveSession.id}`,
//                query: { liveSessionId: liveSession.id },
//              }}
//              as={`/livesession/${liveSession.id}`}
//            >
//              <h2 className="text-2xl pb-2 hover:cursor-pointer hover:underline">
//                {liveSession.title}
//              </h2>
//            </Link>         
//            <p className='leading-normal'>{liveSession.description}</p>
//            <p className="mt-2">
//              Hosted By:{" "}
//              {isLoading ? (
//                <Loading />
//              ) : (
//                <Link
//                  href={`/profile/${liveSession.createdByHcpId}`}
//                  as={`/profile/${liveSession.createdByHcpId}`}
//                >                      
//                  <span className="hover:cursor-pointer hover:underline">
//
//                    {liveSession.userProfileData
//                      ? liveSession.userProfileData.firstName
//                      : ""}{" "}
//                    {liveSession.userProfileData
//                      ? liveSession.userProfileData.lastName
//                      : ""}
//                  </span>
//                </Link>                        
//              )}
//            </p>
//            {user.uid != liveSession.createdByHcpId && (
//              <div className="follow-button inline-block align-middle pt-3 text-sm">
//                <ReportModal
//                  reportingLive={true}
//                  reportedUserData={reportedHCP}
//                  reportedUserId={liveSession.createdByHcpId}
//                ></ReportModal>
//              </div>
//            )}
//            <a className='-m-4 w-12 h-12 bg-blue-dark flex items-center justify-center text-center no-underline rounded-full text-white hover:bg-blue-darker absolute pin-t pin-r' href='#'>
//              <i className='text-xl fa fa-plus'></i>
//            </a>
//          </div>
//          <div className="p-6">
//            Live at:
//            <p className="h-full text-2xl">{liveSession.upcomingTime}</p>
//          </div>          
//        </div>
//      </div>
//    </div>
  );
};

export default UpcomingLiveSession;
