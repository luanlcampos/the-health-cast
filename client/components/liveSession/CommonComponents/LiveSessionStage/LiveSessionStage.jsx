import { JitsiMeeting } from "@jitsi/react-sdk";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

const LiveSessionStage = ({
  liveSessionRoomID,
  hcpCreatorInfo,
  currentUser,
  currentUserData,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const creatorStatus = hcpCreatorInfo.uid == currentUser.uid;
  console.log("rendering");
  console.log(hcpCreatorInfo.uid);
  console.log(currentUser.uid);
  console.log(creatorStatus);
  console.log(currentUserData);

  const creatorTools = [
    "microphone",
    "camera",
    "closedcaptions",
    "desktop",
    "fullscreen",
    "livestreaming",
    "help",
    "mute-everyone",
    "mute-video-everyone",
    "security",
  ];

 const  regularTools = ["fullscreen", "raisehand"];
  useEffect(() => {
    if (
      currentUserData &&
      currentUserData.firstName &&
      currentUserData.lastName
    )
      setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <JitsiMeeting
          configOverwrite={{
            prejoinPageEnabled: false, //This here
            startSilent: !creatorStatus,
            startWithVideoMuted: !creatorStatus,
            localRecording: { enabled: creatorStatus },
            toolbarButtons: creatorStatus ? creatorTools : regularTools,
          }}
          roomName={`${liveSessionRoomID}`}
          userInfo={{
            displayName: `${currentUserData.firstName} ${currentUserData.lastName}`,
          }}
          getIFrameRef={(node) => {
            node.style.width = "100%";
            node.style.height = "100%";
          }}
        />
      )}
    </>
  );
};

export default LiveSessionStage;
