import { useState, useEffect } from "react";
import { useAuth } from "@/firebase/auth";
import Loading from "@/components/Loading";
import SignedLayout from "@/components/Layout/SignedLayout";
import { Avatar } from "@mui/material";
import Image from "next/image";
import {
  doc,
  getDoc,
  arrayRemove,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { AiOutlineLoading } from "react-icons/ai";
// import { useRouter } from "next/router";

import ReportModal from "@/components/reportModal";

const Profile = ({ userProfileData, userId, isAdmin }) => {
  const { user, userData, adminData } = useAuth();
  // const router = useRouter();

  //profileOwner state
  const [isProfileOwner, setIsProfileOwner] = useState(null);

  // isFollowing state
  const [isFollowing, setIsFollowing] = useState(false);

  // isFollowingLoading state
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  useEffect(() => {
    if (userData && userData.following.includes(userId)) {
      setIsFollowing(true);
    }
  }, []);

  if (!user) {
    router.push("/login");
    return;
  }

  if (user && !userData && !adminData) {
    return <Loading />;
  }

  if (user.uid === userId) {
    setIsProfileOwner(true);
  }

  const getUserInitials = () => {
    // if user is not an admin
    if (!isAdmin) {
      return (
        userProfileData.firstName.charAt(0) + userProfileData.lastName.charAt(0)
      ).toUpperCase();
    }
    // if user is an admin
    const nameArray = userProfileData.institution.split(" ");
    const orgInitials = "";
    for (let i = 0; i < nameArray.length; i++) {
      orgInitials += nameArray[i].charAt(0);
    }
    return orgInitials.toUpperCase();
  };

  const handleFollowBtn = async (e) => {
    e.preventDefault();
    try {
      setIsFollowingLoading(true);
      if (!isProfileOwner && userData) {
        if (!isFollowing) {
          console.log("following", user.uid, userData.following);
          await updateDoc(doc(db, "users", String(user.uid)), {
            following: arrayUnion(userId),
          });
          setIsFollowing(true);
        } else {
          console.log("unfollowing", user.uid, userData.following);
          await updateDoc(doc(db, "users", String(user.uid)), {
            following: arrayRemove(userId),
          });
          setIsFollowing(false);
        }
        setIsFollowingLoading(false);
      }
    } catch (error) {
      console.warn(error);
      setIsFollowingLoading(false);
    }
  };

  console.log({userProfileData});
  return (
    <SignedLayout>
      {userProfileData ? (
        <div className="user-profile">
          <div className="user-header">
            <div className="user-avatar">
              <Avatar
                sx={{ width: "150px", height: "150px", bgcolor: "#9FC131" }}
              >
                {getUserInitials()}
              </Avatar>
            </div>
            <div className="user-info">
              <div className="user-name">
                <span className="pr-4">
                  {!isAdmin
                    ? userProfileData.firstName + " " + userProfileData.lastName
                    : userProfileData.institution}
                </span>
                {userProfileData?.isHcp ? (
                  <Image src="/images/hcpLogo.svg" width="30px" height="30px" />
                ) : (
                  ""
                )}
              </div>
              <div className="user-bio">
                <span className="pr-4">
                  {userData ? userData.biography : adminData.biography}
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  Aenean commodo ligula eget dolor. Aenean massa.
                </span>
              </div>
              {!isAdmin && !isProfileOwner && (
                <div className="follow-button">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => handleFollowBtn(e)}
                  >
                    {isFollowingLoading ? (
                      <AiOutlineLoading className="loading-spinner" />
                    ) : !isFollowing ? (
                      <div className="flex items-center gap-x-3 ">
                        <RiUserFollowLine /> <p>Follow</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-x-3 ">
                        <RiUserUnfollowLine /> <p>Unfollow</p>
                      </div>
                    )}
                  </button>
                </div>
              )}
            
            {/* This is user to be reported from (userId) */}
            <div className="follow-button"> 
                <ReportModal reportedUserData={userProfileData} reportedUserId={userId}></ReportModal>
            </div>
              
              {/* <span className="pr-4">
                The following data should be send when submitting a report:
              </span>
              <span className="pr-4">
                User to be reported: {userId}
              </span>
              <span>
                HCP Org: {userProfileData.hcpOrg.orgId} 
              </span> */}
            {/* <ReportModal reportedUserData={userProfileData} reportedUserId={userId}></ReportModal> */}
            </div>
          </div>
          {!isAdmin && (
            <div className="user-interests">
              <div className="user-interests-header">
                <span className="pr-4">Interests</span>
              </div>
              <div className="user-interests-list">
                {userProfileData.interests.map((interest, index) => (
                  <div key={index} className="interest-card pr-4">
                    {interest}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="user-not-found flex items-center justify-center m-0 h-[calc(100%-70px)]">
          {" "}
          User not found{" "}
        </div>
      )}
    </SignedLayout>
  );
};

export async function getServerSideProps(context) {
  const { userId } = context.query;
  let isAdmin = false;
  let userProfileData;
  try {
    const userResult = await getDoc(doc(db, "users", String(userId)));
    if (userResult && userResult.exists()) {
      userProfileData = userResult.data();
      isAdmin = false;
    } else {
      const result = await getDoc(doc(db, "admin", String(userId)));
      if (result && result.exists()) {
        userProfileData = result.data();
        isAdmin = true;
      } else {
        userProfileData = null;
      }
    }
    console.log("userProfileData", userProfileData);
    if (!isAdmin && userProfileData) {
      userProfileData.createdAt = JSON.stringify(userProfileData.createdAt);
      userProfileData.updatedAt = JSON.stringify(userProfileData.updatedAt);
      userProfileData.firstMonthlyReportDate = JSON.stringify(userProfileData.firstMonthlyReportDate);
    }
  } catch (error) {
    console.warn(error);
    userProfileData = null;
  }

  return {
    props: {
      userProfileData,
      userId,
      isAdmin,
    },
  };
}

export default Profile;
