import { useState, useEffect, useMemo } from "react";
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
import { AiOutlineLoading, AiOutlineClose } from "react-icons/ai";
import { HiOutlineRefresh } from "react-icons/hi";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import list from "@/data/listOfConsumerHealthInfoTopic";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import EditBioModal from "@/components/Profile/EditBioModal";

// shuffle function to shuffle a list
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const Profile = ({ userProfileData, userId, isAdmin }) => {
  const router = useRouter();
  const { user, userData, adminData } = useAuth();
  const itemsPerPage = 6;

  // interestsList state
  const interestsFullList = useMemo(() => shuffle(list), [userData]);

  const [interestsList, setInterestsList] = useState(
    interestsFullList.slice(0, itemsPerPage)
  );

  // interestPage state
  const [interestListPage, setInterestListPage] = useState(0);

  // interestsAddedList state
  const [interestsAddedList, setInterestsAddedList] = useState([]);

  // interestModalOpen state
  const [interestModalOpen, setInterestModalOpen] = useState(null);

  // userInrests state
  const [userInterests, setUserInterests] = useState([]);

  //profileOwner state
  const [isProfileOwner, setIsProfileOwner] = useState(false);

  // isFollowing state
  const [isFollowing, setIsFollowing] = useState(false);

  // isFollowingLoading state
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  // open edit bio modal state
  const [openEditBioModal, setOpenEditBioModal] = useState(false);

  // userBio state
  const [userBio, setUserBio] = useState("");

  // userInterestsChanged state
  const [userInterestsChanged, setUserInterestsChanged] = useState(false);

  useEffect(() => {
    if (userData && userData.following.includes(userId)) {
      setIsFollowing(true);
    }
  }, [userData]);

  useEffect(() => {
    if (userData && userData.interests.length > 0) {
      const isAdded = interestsList.findIndex((item) =>
        userData.interests.includes(item)
      );
      // remove isAdded from list
      if (isAdded > -1) {
        interestsList.splice(isAdded, 1);
        setInterestsList(interestsList);
      }
    }
  }, [interestsList]);

  useEffect(() => {
    if (user.uid === userId) {
      setIsProfileOwner(true);
    }
  }, [userId]);

  useEffect(() => {
    setUserInterests(userProfileData.interests);
  }, [userInterests]);

  useEffect(() => {
    setUserBio(userProfileData.biography);
  }, [userBio]);

  if (!user) {
    router.push("/login");
    return;
  }

  if (user && !userData && !adminData) {
    return <Loading />;
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
      if ((!isProfileOwner && userData) || adminData) {
        const col = userData ? "users" : "admin";
        const followersCol = isAdmin ? "admin" : "users";
        if (!isFollowing) {
          await updateDoc(doc(db, String(col), String(user.uid)), {
            following: arrayUnion(userId),
          });

          // add current user to the user's followers list
          await updateDoc(doc(db, String(followersCol), String(userId)), {
            followers: arrayUnion(user.uid),
          });
          setIsFollowing(true);
        } else {
          await updateDoc(doc(db, String(col), String(user.uid)), {
            following: arrayRemove(userId),
          });

          // remove current user from the user's followers list
          await updateDoc(doc(db, String(followersCol), String(userId)), {
            followers: arrayRemove(user.uid),
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

  const handleCloseInterestsModal = (e) => {
    e.stopPropagation();
    setInterestModalOpen(false);
  };

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setInterestModalOpen(true);
  };

  const handleInterestReload = (e) => {
    e.stopPropagation();
    setInterestListPage(interestListPage + 1);
    if (interestListPage * itemsPerPage + 6 >= interestsFullList.length) {
      setInterestListPage(0);
    }
    const nextIndex = interestListPage * itemsPerPage;
    setInterestsList(
      interestsFullList.slice(nextIndex, nextIndex + itemsPerPage)
    );
  };

  const handleInterestAdd = async (e, interest) => {
    e.stopPropagation();
    if (userData) {
      try {
        updateDoc(doc(db, "users", String(user.uid)), {
          interests: arrayUnion(interest),
        });
        let newInterestsAddedList = [...interestsAddedList];
        newInterestsAddedList.push(interest);
        setInterestsAddedList(newInterestsAddedList);
        userProfileData.interests.push(interest);

        // remove interest from interestsList
        const isAdded = interestsList.findIndex((item) => {
          return item.value === interest;
        });

        // remove isAdded from list
        if (isAdded > -1) {
          interestsList.splice(isAdded, 1);
          setInterestsList(interestsList);
        }

        if (interestsList.length === 0) {
          handleInterestReload(e);
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const handleDeleteInterest = async (e, interest) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to remove ${interest} from your interests?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    });
    if (res.isConfirmed && userData) {
      try {
        updateDoc(doc(db, "users", String(user.uid)), {
          interests: arrayRemove(interest),
        });

        // update the interests list
        const isRemoved = userProfileData.interests.findIndex(
          (item) => item === interest
        );
        userProfileData.interests.splice(isRemoved, 1);
        setUserInterests(userProfileData.interests);
        setUserInterestsChanged(!userInterestsChanged);
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const reloadUserInterests = async (e) => {
    // get the user's interests
    const newUserInterests = await (
      await getDoc(doc(db, "users", String(userId)))
    ).data().interests;
    userProfileData.interests = newUserInterests;
    setUserInterests(newUserInterests);
  };

  return (
    <>
      {openEditBioModal && (
        <EditBioModal
          mbio={userProfileData.biography}
          isOpen={openEditBioModal}
          userId={userId}
          isAdmin={isAdmin}
          handleClose={setOpenEditBioModal}
          setUserBio={setUserBio}
          userProfileData={userProfileData}
        />
      )}
      {interestModalOpen && (
        <div
          className="modal edit-interests-modal fade-enter"
          onClick={(e) => handleCloseInterestsModal(e)}
        >
          <div className="modal-container edit-interests-modal-container">
            <div className="edit-interests-modal-header text-center">
              <h2 className="text-2xl text-center">
                Let us know what you are interested in
              </h2>
              <span className="text-gray-500 text-center">
                Select the topics you are interested in, so we can filter them
                for you!
              </span>
            </div>
            <div className="edit-interests-modal-body">
              {interestsList.map((item, index) => {
                return (
                  <div
                    className={`interest-card ${
                      interestsAddedList.includes(item)
                        ? "interest-card-added"
                        : ""
                    }`}
                    key={`interest-${index}`}
                    onClick={(e) => handleInterestAdd(e, item.value)}
                  >
                    <span className="text-ellipsis break-words">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="edit-interests-modal-footer">
              <button
                onClick={(e) => handleInterestReload(e)}
                className="refresh-btn "
              >
                {" "}
                <HiOutlineRefresh />
              </button>
              <button
                onClick={(e) => handleCloseInterestsModal(e)}
                className="finish-btn"
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      )}
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
                      ? userProfileData.firstName +
                        " " +
                        userProfileData.lastName
                      : userProfileData.institution}
                  </span>
                  {userProfileData?.isHcp ? (
                    <Image
                      src="/images/hcpLogo.svg"
                      width="30px"
                      height="30px"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="user-bio">
                  <span className="pr-4 whitespace-pre-line">{userBio}</span>
                </div>
                {!isProfileOwner && (
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
                {isProfileOwner && (
                  <div className="edit-profile-button ">
                    <button
                      className="btn btn-primary border px-3 py-2 rounded-md text-sm"
                      onClick={() => setOpenEditBioModal(true)}
                    >
                      Edit Bio
                    </button>
                  </div>
                )}
              </div>
            </div>
            {!isAdmin && (
              <div className="user-interests">
                <div className="user-interests-header">
                  <h2 className="pr-4 text-2xl">Interests</h2>
                  {isProfileOwner && (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={(e) => handleOpenModal(e)}
                      >
                        Add More
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={(e) => reloadUserInterests(e)}
                      >
                        Reload
                      </button>
                    </>
                  )}
                </div>
                <div className="user-interests-list">
                  {userInterests.length > 0 ? (
                    userInterests.map((interest, index) => (
                      <div key={index} className="interest-card pr-4">
                        {isProfileOwner && (
                          <div className="delete-interest">
                            <button
                              className="btn btn-primar"
                              onClick={(e) => handleDeleteInterest(e, interest)}
                            >
                              <AiOutlineClose />
                            </button>
                          </div>
                        )}
                        {interest}
                      </div>
                    ))
                  ) : (
                    <div className="no-interests">
                      <span className="text-gray-500">
                        No interests added yet
                      </span>
                    </div>
                  )}
                </div>
                <hr />
              </div>
            )}
            <div className="user-activities">
              <div className="user-activities-header">
                <h2 className="pr-4 text-3xl">Recent Activities</h2>
              </div>
            </div>
          </div>
        ) : (
          <div className="user-not-found flex items-center justify-center m-0 h-[calc(100%-70px)]">
            {" "}
            User not found{" "}
          </div>
        )}
      </SignedLayout>
    </>
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
    }
    if (userProfileData && userProfileData.firstMonthlyReportDate) {
      userProfileData.firstMonthlyReportDate = JSON.stringify(
        userProfileData.firstMonthlyReportDate
      );
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
